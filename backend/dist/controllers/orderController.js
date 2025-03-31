var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
    }
}
catch (error) {
    console.error("Failed to initialize Stripe:", error);
}
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
}
catch (error) {
    console.error("Failed to initialize Razorpay:", error);
}
//cod
export const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items, amount, address } = req.body;
        const order = yield prisma.order.create({
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
        yield prisma.user.update({
            where: { id: userId },
            data: { cartData: {} },
        });
        res.json({ success: true, message: "Order Placed", order });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const placeOrderStripe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!stripe) {
            res.json({ success: false, message: "Stripe payment is not available" });
            return;
        }
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers;
        const order = yield prisma.order.create({
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
        const line_items = items.map((item) => ({
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
        const session = yield stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${order.id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${order.id}`,
            line_items,
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const verifyStripe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, success, userId } = req.body;
    try {
        if (success === "true") {
            yield prisma.order.update({
                where: { id: orderId },
                data: { payment: true },
            });
            yield prisma.user.update({
                where: { id: userId },
                data: { cartData: {} },
            });
            res.json({ success: true });
        }
        else {
            yield prisma.order.delete({
                where: { id: orderId },
            });
            res.json({ success: false });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const placeOrderRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!razorpayInstance) {
            res.json({ success: false, message: "Razorpay payment is not available" });
            return;
        }
        const { userId, items, amount, address } = req.body;
        const order = yield prisma.order.create({
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
        const razorpayOrder = yield razorpayInstance.orders.create(options);
        res.json({ success: true, order: razorpayOrder });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const verifyRazorpay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!razorpayInstance) {
            res.json({ success: false, message: "Razorpay payment is not available" });
            return;
        }
        const { userId, razorpay_order_id } = req.body;
        const razorpayOrder = yield razorpayInstance.orders.fetch(razorpay_order_id);
        if (razorpayOrder.status === "paid") {
            yield prisma.order.update({
                where: { id: razorpayOrder.receipt },
                data: { payment: true },
            });
            yield prisma.user.update({
                where: { id: userId },
                data: { cartData: {} },
            });
            res.json({ success: true, message: "Payment Successful" });
        }
        else {
            res.json({ success: false, message: "Payment Failed" });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const allOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany();
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const userOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const orders = yield prisma.order.findMany({
            where: { userId: userId },
        });
        res.json({ success: true, orders });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId, status } = req.body;
        yield prisma.order.update({
            where: { id: orderId },
            data: { status },
        });
        res.json({ success: true, message: "Status Updated" });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
//# sourceMappingURL=orderController.js.map