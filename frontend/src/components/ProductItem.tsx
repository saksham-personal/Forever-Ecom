import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

interface ProductItemProps {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ id, image, name, price }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    throw new Error("ShopContext must be used within a ShopContextProvider");
  }

  const { currency } = shopContext;

  return (
    <Link to={`/product/${id}`} className="text-gray-800 cursor-pointer">
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={image[0]}
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">{currency}{price}</p>
    </Link>
  );
};

export default ProductItem;
