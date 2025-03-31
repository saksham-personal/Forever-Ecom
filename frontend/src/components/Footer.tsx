import React from 'react';
import { assets } from '../assets/assets';

const Footer: React.FC = () => {
  return (
    <>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        <div>
          <img src={assets.logo} className='mb-5 w-32' alt="Logo" />
          <p className='w-full md:w-2/3 text-gray-600'>Dummy</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>Home</li>
            <li>About</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-1 text-gray-600'>
            <li>
              <a href="tel:+919289027684" className="hover:text-blue-500">
                +91 9289027684
              </a>
            </li>
            <li>
              <a href="mailto:saksham.kaushal.offical@gmail.com" className="hover:text-blue-500">
                saksham.kaushal.offical@gmail.com
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/transexamicacid/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/sakshamkaushal" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Saksham Kaushal</p>
      </div>
    </>
  );
};

export default Footer;
