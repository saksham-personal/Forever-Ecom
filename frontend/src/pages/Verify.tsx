import { useContext, useEffect } from 'react'; // Removed React import
import { ShopContext } from '../context/ShopContext'; // Import ShopContextType
import { useSearchParams, useNavigate } from 'react-router-dom'; // Import useNavigate here if not relying solely on context
import { toast } from 'react-toastify';
import axios from 'axios';

// Helper function to safely get error message
const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    try {
        return new Error(JSON.stringify(error)).message;
    } catch {
        return String(error);
    }
};

const Verify = () => {

    // Safely access context and provide defaults
    const context = useContext(ShopContext);
    const token = context?.token ?? "";
    const setCartItems = context?.setCartItems ?? (() => {});
    const backendUrl = context?.backendUrl ?? "";
    // Use navigate from context OR import directly if context might be slow/unavailable initially
    const navigate = context?.navigate ?? useNavigate();

    // Get only searchParams, ignore setSearchParams
    const [searchParams] = useSearchParams();

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment = async () => {
        // Ensure necessary data is available
        if (!token || !backendUrl || !success || !orderId) {
            toast.error("Verification failed: Missing required information.");
            navigate('/'); // Redirect if essential info is missing
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success: success === 'true', orderId }, // Convert success string to boolean
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success("Order Verified Successfully!");
                setCartItems({}); // Clear cart on successful verification
                navigate('/orders');
            } else {
                toast.error(response.data.message || "Payment verification failed.");
                navigate('/cart'); // Redirect to cart on failure
            }

        } catch (error) {
            console.error("Verification Error:", error);
            toast.error(`Verification failed: ${getErrorMessage(error)}`);
            navigate('/'); // Redirect to home or another appropriate page on error
        }
    }

    useEffect(() => {
        // Run verification only once when component mounts and has necessary info
        verifyPayment();
    }, []); // Empty dependency array ensures it runs once on mount

    // Display a loading or processing indicator
    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='w-20 h-20 border-t-4 border-b-4 border-gray-900 rounded-full animate-spin'></div>
            <p className='ml-4 text-gray-600'>Verifying payment...</p>
        </div>
    )
}

export default Verify;
