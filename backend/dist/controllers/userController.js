var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};
// Route 
export const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.json({ success: false, message: "User doesn't exist" });
            return;
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken(user.id);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        // Check if user already exists
        const exists = yield prisma.user.findUnique({
            where: { email },
        });
        if (exists) {
            res.json({ success: false, message: "User already exists" });
            return;
        }
        // Validate email format and strong password
        if (!validator.isEmail(email)) {
            res.json({ success: false, message: "Please enter a valid email" });
            return;
        }
        if (password.length < 8) {
            res.json({ success: false, message: "Please enter a strong password" });
            return;
        }
        // Hashing user password
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(password, salt);
        const newUser = yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        const token = createToken(newUser.id);
        res.json({ success: true, token });
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(`${email}${password}`, process.env.JWT_SECRET);
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
//# sourceMappingURL=userController.js.map