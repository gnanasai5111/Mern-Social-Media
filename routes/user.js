import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
  toggleFriend,
  getAllUsers
} from "../controllers/user.js";
import { upload } from "../middleware/multer.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//  delete user
router.delete("/:id", verifyToken, deleteUser);

// Update user
router.put("/:id", verifyToken, upload.single("image"), updateUser);

// get  user
router.get("/:id", verifyToken, getUser);


// get all user
router.get("/all/users", verifyToken, getAllUsers);

//  follow and unfollow user
router.put("/friendship/:id", verifyToken, toggleFriend);

export default router;
