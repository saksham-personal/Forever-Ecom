var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
const authUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.token;
        if (!token) {
            res.json({ success: false, message: "Not Authorized. Login Again" });
            return;
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decodedToken.id;
        next();
    }
    catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
});
export default authUser;
//# sourceMappingURL=authUser.js.map