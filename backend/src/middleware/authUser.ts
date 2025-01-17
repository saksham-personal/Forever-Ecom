import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.headers.token as string;

        if (!token) {
            res.json({ success: false, message: "Not Authorized. Login Again" });
            return;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

        req.body.userId = decodedToken.id;
        next();
    } catch (error: any) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
