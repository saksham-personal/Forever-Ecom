var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const port = parseInt(process.env.PORT || "4000", 10);
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectDb();
            connectCloudinary();
            app.use(express.json());
            app.use(cors());
            app.use("/api/user", userRouter);
            app.use("/api/product", productRouter);
            app.use("/api/cart", cartRouter);
            app.use("/api/order", orderRouter);
            app.listen(port, () => console.log(`Server started on PORT: ${port}`));
        }
        catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    });
}
startServer();
//# sourceMappingURL=index.js.map