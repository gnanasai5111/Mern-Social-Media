import express from "express";
import {
  createPost,
  deletePost,
  getAllYourPosts,
  getTimelinePosts,
  updatePost,
  toggleLike,
} from "../controllers/post.js";
import { upload } from "../middleware/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a Post

router.post("/", verifyToken, upload.single("image"), createPost);

// Update a Post
router.put("/:postId",verifyToken, upload.single("image"), updatePost);

// Delete a Post
router.delete("/:postId",verifyToken, deletePost);

// Get Timeline Posts
router.get("/timeline/all",verifyToken, getTimelinePosts);

// Get all your Posts
router.get("/all/:userId",verifyToken, getAllYourPosts);

// like and unlike a post
router.put("/toggle/likes", verifyToken,toggleLike);

export default router;
