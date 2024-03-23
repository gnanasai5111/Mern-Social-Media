import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["photo", "video"],
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // Expires in 24 hours
  },
});

export default mongoose.model("Story", StorySchema);
