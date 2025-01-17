import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

interface Product {
  id: string;
  image: string[];
  name: string;
  price: number;
}

const LatestCollection: React.FC = () => {
  const  shopContext = useContext(ShopContext);

  if (!shopContext) {
    throw new Error("ShopContext must be used within a ShopContextProvider");
  }

  const { products }: { products: Product[] } = shopContext;
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Ensure products exist before slicing
    setLatestProducts(products.slice(0, 12));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Brand New Deals
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {latestProducts.map((product) => (
          <div key={product.id} className="product-items">
            <ProductItem 
              id={product.id} 
              image={product.image} 
              name={product.name} 
              price={product.price} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
