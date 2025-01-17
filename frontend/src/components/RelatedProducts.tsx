import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Product } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  onProductClick: () => void; // Function to scroll to the top
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, subCategory, onProductClick }) => {
  const { products } = useContext(ShopContext) as { products: Product[] };
  const [rel, setRel] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      let pCopy = [...products];

      pCopy = pCopy.filter((item) => category === item.category);
      pCopy = pCopy.filter((item) => subCategory === item.subCategory);

      setRel(pCopy.slice(0, 4));
    }
  }, [products, category, subCategory]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {rel.map((item, idx) => (
          <ProductItem
            key={idx}
            id={item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
