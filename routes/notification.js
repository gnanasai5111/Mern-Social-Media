import express from "express";
import {
  getNotifications,
  markNotification,
} from "../controllers/notification.js";

const router = express.Router();


router.get("/:userId", getNotifications);

router.put("/:notificationId/:userId", markNotification);

export default router;
