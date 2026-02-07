import express from "express";
import { getAllContacts, getChatsPartners, getMessagesByUderId, sendMessage } from "../controllers/message.controller.js";
import { arcjetProtection } from "../lib/middleware/arcjet.middleware.js";
import { protectRoute } from "../lib/middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute)

router.get("/contact", getAllContacts)
router.get("/chats", getChatsPartners)
router.get("/:id", getMessagesByUderId)
router.post("/send/:id", sendMessage)

export default router;