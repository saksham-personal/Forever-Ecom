import express from "express";
import cors from "cors";
import connectCloudinary from "./config/cloudinary";
import userRouter from "./routes/userRoute";
import productRouter from "./routes/productRoute";
import cartRouter from "./routes/cartRoute";
import orderRouter from "./routes/orderRoute";
import app from "./app";
const port = parseInt(process.env.PORT || "4000", 10);
console.log(port);
connectCloudinary();
app.use(express.json());
app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
//# sourceMappingURL=index.js.map