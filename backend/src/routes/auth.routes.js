import express from "express";
import { login, logout, signUp, updateProfile } from "../controllers/auth.controller.js";
import { sendFCM } from "../controllers/firebase_notification.js";
import { protectRoute } from "../lib/middleware/auth.middleware.js";

const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup", signUp);
router.get("/send", sendFCM);

router.post("/login", login);
router.post("/logout", logout);
router.post("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user))

export default router;

///Middle wares 