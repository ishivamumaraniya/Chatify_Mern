import jwt from "jsonwebtoken";
import User from "../../model/user.model.js";
import { ENV } from "../env.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "No token provided" })
        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) return res.status(401).json({ message: "Invalid token provided" });
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "User Not Found" });
        req.user = user;
        next();
    } catch (e) {
        return res.status(500).json({ message: "Error in Middle ware" })
    }
}

