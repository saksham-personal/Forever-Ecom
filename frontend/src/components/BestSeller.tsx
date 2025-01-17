import React, { useContext, useState, useEffect, FC } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Product } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller: FC = () => {
    const { products } = useContext(ShopContext)!; 
    const [bestSeller, setBestSeller] = useState<Product[]>([]);

    useEffect(() => {
        const bestProduct = products.filter((product) => product.bestseller);
        setBestSeller(bestProduct.slice(0, 6)); // Limit to 6 bestsellers
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1='BEST' text2='SELLERS' />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Brand New Deals
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                {bestSeller.map((product) => (
                    <div key={product.id} className='best-seller-items'>
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

export default BestSeller;
