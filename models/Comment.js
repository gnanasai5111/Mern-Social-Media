import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type: String,
    ref: "User",
  },
  profilePicture: {
    type: String,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("Comment", CommentSchema);
