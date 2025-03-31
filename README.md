# Forever Full-Stack E-commerce Platform

A full-stack e-commerce platform built with React 18, Express.js, and Prisma with MongoDB.

## Project Structure

- **Frontend**: React 18 with TypeScript, Tailwind CSS, and Vite
- **Backend**: Express.js with TypeScript and Prisma ORM
- **Database**: MongoDB

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order placement and tracking
- Payment integration with Stripe and Razorpay
- Admin dashboard for product management

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```

3. Configure environment variables:
   - Backend: Create a `.env` file in the `backend` directory with your MongoDB connection string and other credentials
   - Frontend: Create a `.env` file in the `frontend` directory with the backend URL

4. Run the development server:
   ```
   npm run dev
   ```

   This will start both the frontend and backend servers concurrently.

5. Build for production:
   ```
   npm run build
   ```

6. Start the production server:
   ```
   npm start
   ```

## Backend API Endpoints

- **User Routes**:
  - POST `/api/user/register`: Register a new user
  - POST `/api/user/login`: Login a user
  - POST `/api/user/admin`: Login as admin

- **Product Routes**:
  - GET `/api/product/list`: Get all products
  - POST `/api/product/add`: Add a new product (admin only)
  - POST `/api/product/remove`: Remove a product (admin only)
  - POST `/api/product/single`: Get a single product

- **Cart Routes**:
  - POST `/api/cart/add`: Add a product to cart
  - POST `/api/cart/update`: Update product quantity in cart
  - POST `/api/cart/get`: Get user's cart

- **Order Routes**:
  - POST `/api/order/place`: Place a COD order
  - POST `/api/order/place-stripe`: Place an order with Stripe
  - POST `/api/order/verify-stripe`: Verify Stripe payment
  - POST `/api/order/place-razorpay`: Place an order with Razorpay
  - POST `/api/order/verify-razorpay`: Verify Razorpay payment
  - GET `/api/order/all`: Get all orders (admin only)
  - POST `/api/order/user`: Get user's orders
  - POST `/api/order/update-status`: Update order status (admin only)

## Technologies Used

- **Frontend**:
  - React 18
  - TypeScript
  - React Router
  - Tailwind CSS
  - Axios
  - React Toastify

- **Backend**:
  - Express.js
  - TypeScript
  - Prisma ORM
  - JSON Web Tokens (JWT)
  - Bcrypt
  - Multer
  - Cloudinary
  - Stripe
  - Razorpay

## License

This project is licensed under the MIT License - see the LICENSE file for details.
