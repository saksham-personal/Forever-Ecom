import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, itemId, size } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId},
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
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = { [size]: 1 };
        }

        await prisma.user.update({
            where: { id: userId},
            data: { cartData },
        });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const updateCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, itemId, size, quantity } = req.body;

        const user = await prisma.user.findUnique({
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
        } else {
            res.json({ success: false, message: "Item not found in cart" });
            return;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { cartData },
        });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const getUserCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { cartData: true },
        });

        if (!user) {
            res.json({ success: false, message: "User not found" });
            return;
        }

        res.json({ success: true, cartData: user.cartData });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
