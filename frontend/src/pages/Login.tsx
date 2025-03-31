import { useContext, useEffect, useState, FormEvent } from 'react'; // Removed React import, added FormEvent
import { ShopContext } from '../context/ShopContext'; // Import ShopContextType
import axios from 'axios';
import { toast } from 'react-toastify';

// Helper function to safely get error message (similar to ShopContext)
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  try {
    return new Error(JSON.stringify(error)).message;
  } catch {
    return String(error);
  }
};

const Login = () => {

  const [currentState, setCurrentState] = useState<'Login' | 'Sign Up'>('Login'); // Explicit type for state

  // Safely access context and provide defaults
  const context = useContext(ShopContext);
  const token = context?.token ?? "";
  const setToken = context?.setToken ?? (() => {}); // Default empty function
  const navigate = context?.navigate ?? (() => {}); // Default empty function
  const backendUrl = context?.backendUrl ?? ""; // Default empty string or a sensible default

  const [name,setName] = useState('');
  const [password,setPasword] = useState('');
  const [email,setEmail] = useState('');

  // Add type to event parameter
  const onSubmitHandler = async (event: FormEvent) => {
      event.preventDefault();

      // Ensure backendUrl is available
      if (!backendUrl) {
          toast.error("Backend URL is not configured.");
          return;
      }

      const url = currentState === 'Login'
          ? `${backendUrl}/api/user/login`
          : `${backendUrl}/api/user/register`;

      const payload = currentState === 'Login'
          ? { email, password }
          : { name, email, password };

      try {
          const response = await axios.post(url, payload);

          if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            // No need to navigate here, useEffect below handles it
          } else {
            toast.error(response.data.message);
          }

      } catch (error) {
        console.error("Login/Register Error:", error); // Log the full error
        // Use helper function to get error message
        toast.error(getErrorMessage(error));
      }
  }

  useEffect(()=>{
    if (token) {
      console.log("Token found, navigating to home:", token); // Debug log
      navigate('/');
    }
  },[token, navigate]) // Add navigate to dependency array

  // Handle case where context might still be loading
  if (context === undefined) {
      return <div>Loading...</div>; // Or a spinner
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Sign Up' && ( // Simplified conditional rendering
            <input
                onChange={(e)=>setName(e.target.value)}
                value={name}
                type="text"
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Name'
                required
            />
        )}
        <input
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Email'
            required
        />
        <input
            onChange={(e)=>setPasword(e.target.value)}
            value={password}
            type="password"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Password'
            required
        />
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className=' cursor-pointer'>Forgot your password?</p>
            {
              currentState === 'Login'
              ? <p onClick={()=>setCurrentState('Sign Up')} className=' cursor-pointer'>Create account</p>
              : <p onClick={()=>setCurrentState('Login')} className=' cursor-pointer'>Login Here</p>
            }
        </div>
        <button type="submit" className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
