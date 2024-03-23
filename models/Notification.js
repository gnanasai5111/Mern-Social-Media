import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
