var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Add products to user cart
export const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, itemId, size } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { cartData: true },
        });
        if (!user) {
            res.json({ success: false, message: "User not found" });
            return;
        }
        const cartData = user.cartData || {};
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = { [size]: 1 };
        }
        yield prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });
        res.json({ success: true, message: "Added To Cart" });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
// Update user cart
export const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, itemId, size, quantity } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { cartData: true },
        });
        if (!user) {
            res.json({ success: false, message: "User not found" });
            return;
        }
        const cartData = user.cartData || {};
        if (cartData[itemId] && cartData[itemId][size] !== undefined) {
            cartData[itemId][size] = quantity;
        }
        else {
            res.json({ success: false, message: "Item not found in cart" });
            return;
        }
        yield prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });
        res.json({ success: true, message: "Cart Updated" });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
// Get user cart data
export const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { cartData: true },
        });
        if (!user) {
            res.json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, cartData: user.cartData });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
//# sourceMappingURL=cartController.js.map