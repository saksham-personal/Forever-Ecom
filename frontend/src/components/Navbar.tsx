import React, { useContext } from 'react'
import { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar: React.FC = () => {

    const [vis, setVis] = useState<boolean>(false);
    const context = useContext(ShopContext);
    
    if (!context) {
        throw new Error("Navbar must be used within a ShopContextProvider");
    }
    
    const {showSearch, setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = context;
    const handleMenuClick = () => {
        setVis(true);
      };

      const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

    
      const handleBackClick = () => {
        setVis(false);
      };

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
    <Link to= '/'><img src = {assets.logo} className='w-36' alt="Logo"/></Link>

    <nav className='hidden sm:flex sm:flex-row flex-col items-center gap-5 text-sm text-gray-600'>
  <NavLink to='/' className='flex flex-col items-center gap-1  transform transition-transform duration-300 hover:scale-105 hover:text-black gap-1 will-change-transform antialiased'>
    <p>Home</p>
    <hr className='w-2/4 border-none h-[1.5px] bg-gray-600 hidden'/>
  </NavLink>
  
  <NavLink to='/collection' className='flex flex-col items-center gap-1 transform transition-transform duration-300 hover:scale-105 hover:text-black gap-1 will-change-transform antialiased'>
    <p>Collection</p>
    <hr className='w-2/4 border-none h-[1.5px] bg-gray-600 hidden'/>
  </NavLink>
  
  <NavLink to='/about' className='flex flex-col items-center gap-1 transform transition-transform duration-300 hover:scale-105 hover:text-black gap-1 will-change-transform antialiased'>
    <p>About</p>
    <hr className='w-2/4 border-none h-[1.5px] bg-gray-600 hidden'/>
  </NavLink>

  <NavLink to='/contact' className='flex flex-col items-center gap-1 transform transition-transform duration-300 hover:scale-105 hover:text-black gap-1 will-change-transform antialiased'>
    <p>Contact</p>
    <hr className='w-2/4 border-none h-[1.5px] bg-gray-600 hidden'/>
  </NavLink>
</nav>


    <div className='flex items-center gap-6'>
        <img onClick = {() => setShowSearch(!showSearch)} src={assets.search_icon} className='w-5 cursor-pointer'/>


        <div className='group relative'>
                <img onClick={()=> token ? null : navigate('/login') } className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                {/* Dropdown Menu */}
                {token && 
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-36 py-3 px-5  bg-slate-100 text-gray-500 rounded'>
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>}
            </div> 

        <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5 min-w-5'/>
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[10px]'>{getCartCount()}</p>
        </Link>

        <img onClick= {handleMenuClick} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden'/>

        <div className={` absolute top-0 bottom-0 overflow-hidden bg-white transition-all ${vis ? 'w-full' : 'w-0'}`}>
            <div className = 'flex flex-col text-gray-700'>
                <div onClick = {handleBackClick} className='flex items-center gap-4 p-3 cursor-pointer'>
                    <img src={assets.dropdown_icon} className='h-4 rotate-180'/>
                    <p>Back</p>
                </div>

                <NavLink onClick = {handleBackClick} className='py-2 pl-6 border' to='/'>Home</NavLink>
                <NavLink onClick = {handleBackClick} className='py-2 pl-6 border' to='/collection'>Collection</NavLink>
                <NavLink onClick = {handleBackClick} className='py-2 pl-6 border' to='/About'>About</NavLink>
                <NavLink onClick = {handleBackClick} className='py-2 pl-6 border' to='/contact'>Contact</NavLink>

            {/* //! TODO - transition in menu button  */}

    

            </div>

        </div>

    </div>
    </div>

  )
}

export default Navbar
