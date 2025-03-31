import { useContext, useEffect, useState, FC } from 'react'; // Removed React import
import { Link } from 'react-router-dom'; // Import Link for navigation
import { ShopContext } from '../context/ShopContext';
import { Product } from '../assets/assets';
import Title from './Title';
import ProductItem from './ProductItem';

interface RelatedProductsProps {
  category: string;
  subCategory: string;
  onProductClick: () => void; // Function to scroll to the top
}

const RelatedProducts: FC<RelatedProductsProps> = ({ category, subCategory, onProductClick }) => {
  // Safely access context and provide default value
  const context = useContext(ShopContext);
  const products = context?.products ?? [];

  const [rel, setRel] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let pCopy = [...products];

      // Filter based on category and subCategory, excluding the current product if needed
      // (Assuming the current product might be passed or identified differently if needed)
      pCopy = pCopy.filter((item) => category === item.category && subCategory === item.subCategory);

      // Optionally, filter out the product currently being viewed if this component
      // is used on a product page and you have the current product's ID.
      // pCopy = pCopy.filter((item) => item.id !== currentProductId);

      setRel(pCopy.slice(0, 4)); // Limit to 4 related products
    } else {
      setRel([]); // Reset if products or categories are not available
    }
  }, [products, category, subCategory]); // Dependencies

  // Handle loading state
  if (!context) {
    return <div>Loading related products...</div>;
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {rel.map((item) => (
          // Wrap ProductItem in a Link and call onProductClick
          <Link key={item.id} to={`/product/${item.id}`} onClick={onProductClick}>
             <ProductItem
                id={item.id} // Pass id for ProductItem if needed, or remove if unused
                name={item.name}
                price={item.price}
                image={item.image}
             />
          </Link>
        ))}
      </div>
       {/* Optional: Message if no related products found */}
       {rel.length === 0 && products.length > 0 && (
            <p className="text-center mt-6 text-gray-500">No related products found.</p>
       )}
    </div>
  );
};

export default RelatedProducts;
