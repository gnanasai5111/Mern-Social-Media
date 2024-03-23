import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getAllCommentsOfPost,
} from "../controllers/comment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
// add comment
router.post("/add",verifyToken, addComment);

// update comment
router.put("/:commentId",verifyToken, editComment);

// delete comment
router.delete("/:commentId/:postId",verifyToken, deleteComment);

// get  all comments for a post
router.get("/:postId",verifyToken, getAllCommentsOfPost);

export default router;
