import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removeFromGroup,
  renameGroup,
} from "../controllers/chat.js";

const router = express.Router();

router.post("/", verifyToken, accessChat);
router.get("/", verifyToken, fetchChats);
router.post("/group", verifyToken, createGroupChat);
router.put("/rename", verifyToken, renameGroup);
router.put("/removeFromGroup", verifyToken, removeFromGroup);
router.put("/addToGroup", verifyToken, addToGroup);

export default router;
