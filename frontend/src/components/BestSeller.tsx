import { useContext, useState, useEffect, FC } from 'react'; // Removed React import
import { ShopContext } from '../context/ShopContext';
import { Product } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller: FC = () => {
    // Safely access context and provide default value
    const context = useContext(ShopContext);
    const products = context?.products ?? [];

    const [bestSeller, setBestSeller] = useState<Product[]>([]);

    useEffect(() => {
        // Ensure products array exists and has the 'bestseller' property defined in the Product type
        // Assuming 'bestseller' is a boolean property in the Product interface
        const bestProduct = products.filter((product) => product.bestseller);
        setBestSeller(bestProduct.slice(0, 6)); // Limit to 6 bestsellers
    }, [products]);

    // Optional: Handle loading state if context or products are not ready
    if (!context) {
        return <div>Loading best sellers...</div>; // Or null, or a loading spinner
    }

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
            {/* Optional: Message if no bestsellers found */}
            {bestSeller.length === 0 && products.length > 0 && (
                 <p className="text-center mt-6 text-gray-500">No best sellers found.</p>
            )}
        </div>
    );
};

export default BestSeller;
