import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb";
import connectCloudinary from "./config/cloudinary";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";
import orderRouter from "./routes/orderRoute";
import app from "./app";

const port: number = parseInt(process.env.PORT || "4000", 10);
console.log(port);
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.listen(port, (): void => console.log(`Server started on PORT: ${port}`));
