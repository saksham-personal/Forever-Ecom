import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Function to add a product
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const images = ["image1", "image2", "image3", "image4"]
            .map((key) => req.files?.[key]?.[0])
            .filter(Boolean);

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
                // return 'a';
            })
        );

        const productData = {
            id: uuidv4(),
            name,
            description,
            category,
            price: parseFloat(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: imagesUrl,
        };

        const product = await prisma.product.create({ data: productData });

        res.json({ success: true, message: "Product Added", product });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to list all products
export const listProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany();
        res.json({ success: true, products });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to remove a product
export const removeProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        await prisma.product.delete({
            where: { id },
        });

        res.json({ success: true, message: "Product Removed" });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to get single product info
export const singleProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.body;

        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            res.json({ success: false, message: "Product not found" });
            return;
        }

        res.json({ success: true, product });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
