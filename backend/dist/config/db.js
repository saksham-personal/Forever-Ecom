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
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
function connectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log("Database connected successfully");
        }
        catch (error) {
            console.error("Error connecting to the database:", error);
            throw error;
        }
    });
}
export { prisma, connectDb };
//# sourceMappingURL=db.js.map