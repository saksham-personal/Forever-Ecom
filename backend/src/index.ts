import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db";
import connectCloudinary from "./config/cloudinary";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";
import orderRouter from "./routes/orderRoute";
import app from "./app";

dotenv.config();
const port: number = parseInt(process.env.PORT || "4000", 10);

async function startServer() {
  try {
    await connectDb();
    connectCloudinary();

    app.use(express.json());
    // Configure CORS to accept requests from any domain in production
    app.use(cors({
      origin: process.env.NODE_ENV === 'production' ? '*' : true,
      credentials: true
    }));

    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);

    app.listen(port, (): void => console.log(`Server started on PORT: ${port}`));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
