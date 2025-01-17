import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const adminAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string;

        if (!token) {
            res.json({ success: false, message: "Not Authorized. Login Again" });
            return;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as string;

        if (decodedToken !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            res.json({ success: false, message: "Not Authorized. Login Again" });
            return;
        }

        next();
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
