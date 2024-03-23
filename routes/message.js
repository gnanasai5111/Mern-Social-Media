import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { sendMessage, getMessages } from "../controllers/message.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, getMessages);

export default router;
