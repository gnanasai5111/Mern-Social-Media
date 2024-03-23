import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  try {

    const post = await Post.findById(req.body.postId);
    if (!post) {
      return res.status(404).json({ message: "Invalid Post Id" });
    }
    const comment = await new Comment(req.body);
    await comment.save();
    res
      .status(200)
      .json({ success: true, message: "Comment added Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Invalid comment Id" });
    }
    if (comment.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only edit your own comments" });
    }
    await Comment.findByIdAndUpdate(req.params.commentId, { $set: req.body });
    res
      .status(200)
      .json({ success: true, message: "Comment updated Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Invalid comment Id" });
    }
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found for the comment" });
    }

  
    if (
      comment.userId.toString() !== req.user.userId &&
      post.userId.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res
      .status(200)
      .json({ success: true, message: "Comment Deleted Successfully!" });
  } catch (err) {
    res.status(500).json({ message:err.message });
  }
};

export const getAllCommentsOfPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Invalid Post Id" });
    }
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json({ success: true, comments: comments });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
};
