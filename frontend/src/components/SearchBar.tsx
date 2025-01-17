import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null; // Safeguard if context is undefined
  }

  const { search, setSearch, showSearch, setShowSearch } = shopContext;
  const [vis, setVis] = useState<boolean>(false);
  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname.includes('collection')) {
      setVis(true);
    } else {
      setVis(false);
    }
  }, [loc]);

  return showSearch && vis ? (
    <div className="border-t border-b bg-gray-50 text-center transition-all duration-300 ease-in-out">
      <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="flex-1 outline-none bg-inherit text-sm" 
          type="text" 
          placeholder="Search"
        />
        <img 
          className="w-4" 
          src={assets.search_icon} 
          alt="Search Icon" 
        />
      </div>
      <img 
        onClick={() => setShowSearch(false)} 
        className="inline w-3 cursor-pointer" 
        src={assets.cross_icon} 
        alt="Close Icon" 
      />
    </div>
  ) : null;
};

export default SearchBar;
