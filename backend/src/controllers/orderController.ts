import { Request, Response } from "express";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();
const currency = "inr";
const deliveryCharge = 10;

let stripe;
let razorpayInstance;

try {
    if (process.env.STRIPE_SECRET_KEY) {
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2022-11-15" as any });
    }
} catch (error) {
    console.error("Failed to initialize Stripe:", error);
}

try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        });
    }
} catch (error) {
    console.error("Failed to initialize Razorpay:", error);
}

//cod
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, items, amount, address } = req.body;

        const order = await prisma.order.create({
            data: {
                id: uuidv4(),
                userId: userId,
                items,
                address,
                amount: parseInt(amount),
                paymentMethod: "COD",
                payment: false,
                date: new Date(),
            },
        });

        await prisma.user.update({
            where: { id: userId },
            data: { cartData: {} },
        });

        res.json({ success: true, message: "Order Placed", order });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


export const placeOrderStripe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!stripe) {
            res.json({ success: false, message: "Stripe payment is not available" });
            return;
        }

        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;

        const order = await prisma.order.create({
            data: {
                id: uuidv4(),
                userId: userId,
                items,
                address,
                amount: parseInt(amount),
                paymentMethod: "Stripe",
                payment: false,
                date: new Date(),
            },
        });

        const line_items = items.map((item: any) => ({
            price_data: {
                currency,
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charges" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${order.id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${order.id}`,
            line_items,
            mode: "payment",
        });

        res.json({ success: true, session_url: session.url });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const verifyStripe = async (req: Request, res: Response): Promise<void> => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await prisma.order.update({
                where: { id: orderId },
                data: { payment: true },
            });
            await prisma.user.update({
                where: { id: userId },
                data: { cartData: {} },
            });
            res.json({ success: true });
        } else {
            await prisma.order.delete({
                where: { id: orderId },
            });
            res.json({ success: false });
        }
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const placeOrderRazorpay = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!razorpayInstance) {
            res.json({ success: false, message: "Razorpay payment is not available" });
            return;
        }

        const { userId, items, amount, address } = req.body;

        const order = await prisma.order.create({
            data: {
                id: uuidv4(),
                userId: userId,
                items,
                address,
                amount: parseInt(amount),
                paymentMethod: "Razorpay",
                payment: false,
                date: new Date(),
            },
        });

        const options = {
            amount: parseInt(amount) * 100,
            currency: currency.toUpperCase(),
            receipt: order.id.toString(),
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);
        res.json({ success: true, order: razorpayOrder });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const verifyRazorpay = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!razorpayInstance) {
            res.json({ success: false, message: "Razorpay payment is not available" });
            return;
        }

        const { userId, razorpay_order_id } = req.body;

        const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
        if (razorpayOrder.status === "paid") {
            await prisma.order.update({
                where: { id: razorpayOrder.receipt },
                data: { payment: true },
            });
            await prisma.user.update({
                where: { id: userId },
                data: { cartData: {} },
            });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: "Payment Failed" });
        }
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const allOrders = async (_req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany();
        res.json({ success: true, orders });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const userOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;

        const orders = await prisma.order.findMany({
            where: { userId: userId },
        });

        res.json({ success: true, orders });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderId, status } = req.body;

        await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        res.json({ success: true, message: "Status Updated" });
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
