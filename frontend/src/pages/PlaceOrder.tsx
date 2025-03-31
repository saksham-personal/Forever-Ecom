import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

declare global {
    interface Window {
        Razorpay: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description: string;
            order_id: string;
            receipt: string;
            handler: (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }) => void;
        }) => {
            open: () => void;
        };
    }
}

const PlaceOrder = () => {

    const [method, setMethod] = useState<'cod'|'stripe'|'razorpay'>('cod');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const shopContext = useContext(ShopContext);
    
    if (!shopContext) {
        throw new Error('ShopContext must be used within a ShopContextProvider');
    }

    const { 
        navigate, 
        backendUrl, 
        token, 
        cartItems, 
        setCartItems, 
        getCartAmount, 
        delivery_fee, 
        products 
    } = shopContext;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '', 
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',  
        country: '',
        phone: ''
    })

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    interface RazorpayOrder {
        amount: number;
        currency: string;
        id: string;
        receipt: string;
    }

    const initPay = (order: RazorpayOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEYid,
            amount: order.amount,
            currency: order.currency,
            name:'Order Payment',
            description:'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response: {
                razorpay_payment_id: string;
                razorpay_order_id: string;
                razorpay_signature: string;
            }) => {
                console.log(response)
                try {
                    
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (isSubmitting) return;
        setIsSubmitting(true);
        
        try {
            if (!token) {
                toast.error('Please login to place an order');
                return;
            }

            interface OrderItem {
                id: string;
                name: string;
                price: number;
                sizes: string[];
                size: string;
                quantity: number;
            [key: string]: unknown; // Allow other product properties
            }

            const orderItems: OrderItem[] = [];

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const product = products.find(p => p.id === items);
                        if (product) {
                            const itemInfo = {
                                ...structuredClone(product),
                                size: item,
                                quantity: cartItems[items][item]
                            };
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }
            

            let response;
            
            switch (method) {
                case 'cod':
                    response = await axios.post(
                        `${backendUrl}/api/order/place`,
                        orderData,
                        {headers: {token}}
                    );
                    
                    if (response.data.success) {
                        toast.success('Order placed successfully!');
                        setCartItems({});
                        navigate('/orders');
                    } else {
                        toast.error(response.data.message || 'Failed to place order');
                    }
                    break;

                case 'stripe':
                    response = await axios.post(
                        `${backendUrl}/api/order/stripe`,
                        orderData,
                        {headers: {token}}
                    );
                    
                    if (response.data.success) {
                        const {session_url} = response.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(response.data.message || 'Stripe payment failed');
                    }
                    break;

                case 'razorpay':
                    response = await axios.post(
                        `${backendUrl}/api/order/razorpay`, 
                        orderData, 
                        {headers: {token}}
                    );
                    
                    if (response.data.success) {
                        initPay(response.data.order);
                    } else {
                        toast.error(response.data.message || 'Razorpay payment failed');
                    }

                    break;

                default:
                    break;
            }


        } catch (error: unknown) {
            console.error(error);
            
            let errorMessage = 'An error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    {/* --------------- Payment Method Selection ------------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button 
                            type='submit' 
                            className='bg-black text-white px-16 py-3 text-sm disabled:opacity-50'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Processing...' : 'PLACE ORDER'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
