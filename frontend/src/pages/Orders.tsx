import { useContext, useEffect, useState } from 'react'; // Removed React import
import { ShopContext } from '../context/ShopContext'; // Import ShopContextType
import Title from '../components/Title';
import axios from 'axios';

// Define interfaces based on usage and expected API response
interface OrderItem {
  // Assuming properties based on usage in the component
  _id: string; // Assuming MongoDB ID or similar unique ID for items
  name: string;
  image: string[]; // Looks like an array based on item.image[0]
  price: number;
  quantity: number;
  size: string;
}

interface Order {
  _id: string; // Assuming MongoDB ID for the order
  items: OrderItem[];
  status: string;
  payment: boolean; // Assuming boolean, adjust if different
  paymentMethod: string;
  date: string | number | Date; // Date can be string, number (timestamp), or Date object
  // Add other potential order properties if needed (e.g., amount, address)
}

// Interface for the flattened structure stored in orderData state
interface FlattenedOrderItem extends OrderItem {
  orderStatus: string; // Renamed to avoid conflict if item itself had 'status'
  orderPayment: boolean; // Renamed
  orderPaymentMethod: string; // Renamed
  orderDate: string | number | Date; // Renamed
}

// Helper function to safely get error message
// const getErrorMessage = (error: unknown): string => {
//     if (error instanceof Error) return error.message;
//     try {
//         return new Error(JSON.stringify(error)).message;
//     } catch {
//         return String(error);
//     }
// };


const Orders = () => {

  // Safely access context and provide defaults
  const context = useContext(ShopContext);
  const backendUrl = context?.backendUrl ?? "";
  const token = context?.token ?? "";
  const currency = context?.currency ?? "$"; // Default currency

  // Initialize state with the correct type
  const [orderData, setOrderData] = useState<FlattenedOrderItem[]>([]);

  const loadOrderData = async () => {
    if (!token || !backendUrl) {
        console.log("Token or Backend URL missing, cannot load orders.");
        setOrderData([]); // Clear data if token/URL is missing
        return; // Exit if no token or backendUrl
    }
    try {
      const response = await axios.post<{ success: boolean; orders: Order[]; message?: string }>(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { token } }
      );

      if (response.data.success) {
        // Explicitly type the accumulator array
        const allOrdersItems: FlattenedOrderItem[] = [];
        response.data.orders.forEach((order: Order) => { // Use forEach for clarity
          order.items.forEach((item: OrderItem) => {
            // Create a new object with combined properties
            allOrdersItems.push({
              ...item, // Spread item properties
              orderStatus: order.status,
              orderPayment: order.payment,
              orderPaymentMethod: order.paymentMethod,
              orderDate: order.date
            });
          });
        });
        // Reverse the flattened list before setting state
        setOrderData(allOrdersItems.reverse());
      } else {
          console.error("Failed to load orders:", response.data.message);
          setOrderData([]); // Clear data on failure
      }

    } catch (error) {
      console.error("Error loading order data:", error);
      // Use helper function for error message
      // toast.error(getErrorMessage(error)); // Optional: Show toast notification
      setOrderData([]); // Clear data on error
    }
  }

  useEffect(()=>{
    loadOrderData();
    // Dependency array includes token and backendUrl as they are used in loadOrderData
  },[token, backendUrl]);

  // Handle loading or context issues
  if (context === undefined) {
      return <div>Loading context...</div>;
  }

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl text-center mb-8'> {/* Added margin-bottom */}
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {orderData.length === 0 ? (
                <p className="text-center text-gray-500">You have no orders yet.</p>
            ) : (
                orderData.map((item) => ( // Use item._id as key if available and unique
                    <div key={item._id || Math.random()} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-start gap-6 text-sm'>
                            {/* Check if image array exists and has elements */}
                            <img className='w-16 sm:w-20 flex-shrink-0' src={item.image?.[0] ?? '/placeholder.png'} alt={item.name} /> {/* Added placeholder and alt */}
                            <div>
                              <p className='sm:text-base font-medium'>{item.name}</p>
                              <div className='flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-base text-gray-700'> {/* Added flex-wrap */}
                                <p>{currency}{item.price}</p>
                                <p>Qty: {item.quantity}</p> {/* Shortened label */}
                                <p>Size: {item.size}</p>
                              </div>
                              {/* Use the renamed properties */}
                              <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.orderDate).toDateString()}</span></p>
                              <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.orderPaymentMethod}</span></p>
                            </div>
                        </div>
                        <div className='md:w-1/2 flex justify-between items-center mt-4 md:mt-0'> {/* Added items-center */}
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${item.orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-orange-400'}`}></p> {/* Dynamic status color */}
                                <p className='text-sm md:text-base'>{item.orderStatus}</p>
                            </div>
                            {/* Avoid reloading all data on track click, ideally link to specific order */}
                            <button className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100'>Track Order</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  )
}

export default Orders;
