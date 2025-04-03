import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import app from "./app.js";

dotenv.config();
const port: number = parseInt(process.env.PORT || "4000", 10);

async function startServer() {
  try {
    await connectDb();
    connectCloudinary();

    app.use(express.json());
    app.use(cors());

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
