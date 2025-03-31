var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const images = ["image1", "image2", "image3", "image4"]
            .map((key) => { var _a, _b; return (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a[key]) === null || _b === void 0 ? void 0 : _b[0]; })
            .filter(Boolean);
        const imagesUrl = yield Promise.all(images.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let result = yield cloudinary.uploader.upload(item.path, { resource_type: "image" });
            return result.secure_url;
            // return 'a';
        })));
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
        const product = yield prisma.product.create({ data: productData });
        res.json({ success: true, message: "Product Added", product });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
// list all products
export const listProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.product.findMany();
        res.json({ success: true, products });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield prisma.product.delete({
            where: { id },
        });
        res.json({ success: true, message: "Product Removed" });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const singleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const product = yield prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            res.json({ success: false, message: "Product not found" });
            return;
        }
        res.json({ success: true, product });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
//# sourceMappingURL=productController.js.map