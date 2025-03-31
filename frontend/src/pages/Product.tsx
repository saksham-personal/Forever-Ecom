import { useContext, useEffect, useState } from 'react' // Remove React import
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'; // Import ShopContextType
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

// Define a basic Product interface based on usage (or import from context if defined there)
interface Product {
  id: string;
  name: string;
  image: string[];
  description: string;
  price: number;
  sizes: string[];
  category: string;
  subCategory: string;
  // Add other properties if they exist based on ShopContext
}

const Product = () => {

  const { productId } = useParams<{ productId: string }>(); // Add type for useParams
  // Explicitly type the context value
  const context = useContext(ShopContext);

  // Add null checks before destructuring
  const products = context?.products ?? [];
  const currency = context?.currency ?? '$'; // Provide a default currency
  const addToCart = context?.addToCart ?? (() => {}); // Provide a default function

  const [productData, setProductData] = useState<Product | null>(null); // Initialize with null and type
  const [image, setImage] = useState<string>(''); // Initialize image state
  const [size,setSize] = useState<string>('') // Initialize size state

  // Use useEffect to find the product when products or productId changes
  useEffect(() => {
    if (products && products.length > 0 && productId) {
      // Find the product directly instead of mapping
      const foundProduct = products.find((item: Product) => item.id === productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image[0]); // Set initial image
        setSize(''); // Reset size selection when product changes
      } else {
        setProductData(null); // Handle case where product is not found
      }
    } else {
        setProductData(null); // Reset if products are not loaded or no productId
    }
  }, [productId, products]); // Dependencies

  // Scroll to top when productData changes (after finding the product)
  useEffect(() => {
    if (productData) {
        window.scrollTo(0, 0);
    }
  }, [productData]);

  // Function to scroll to top, passed to RelatedProducts
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  // Add a loading state or return null/message if context or productData is null
  if (!context) {
    return <div>Loading context...</div>; // Or handle context loading appropriately
  }

  if (!productData) {
    return <div>Loading product details...</div>; // Or a spinner component
  }

  return ( // No need for ternary check here anymore if handled above
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item: string, index: number)=>( // Add types
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item: string, index: number)=>( // Add types
                  <button onClick={()=>setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
          </div>
          {/* Ensure addToCart and productData.id are valid before calling */}
          <button
             onClick={() => {
               if (productData?.id && size) { // Add check for size as well
                 addToCart(productData.id, size);
               } else if (!size) {
                 // Optionally notify user to select a size
                 alert("Please select a size.");
               }
             }}
             className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 disabled:opacity-50'
             disabled={!size} // Disable button if size is not selected
          >
            ADD TO CART
          </button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
          <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
        </div>
      </div>

      {/* --------- display related products ---------- */}
      {/* Ensure category and subCategory exist before rendering */}
      {productData.category && productData.subCategory && (
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
          onProductClick={scrollToTop} // Add onProductClick prop
        />
      )}

    </div>
  )
}

export default Product
