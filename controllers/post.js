import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user?.userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const post = await new Post({
      userId: req.user?.userId,
      desc: req.body.desc,
      image: req.file?.filename,
    });

    await post.save();
    res
      .status(200)
      .json({ success: true, message: "Post Created Successfully!", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(400).json({ message: "Invalid Post Id!" });
    }

    await Post.findByIdAndUpdate(req.params.postId, { $set: req.body });

    res.status(200).json({
      success: true,
      message: "Post Updated Successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(400).json({ message: "Invalid Post Id!" });
    }

    await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTimelinePosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(403).json({ message: "Invalid User Id!" });
    }
    const currentUserPosts = await Post.find({ userId: user._id }).populate(
      "userId",
      "username"
    );

    const followingsPosts = await Promise.all(
      user.followings.map((friendId) => {
        return Post.find({ userId: friendId }).populate("userId", "username");
      })
    );

    const timelinePosts = currentUserPosts
      .concat(...followingsPosts)
      .map((item) => {
        const newItem = { ...item?.toObject(), user: item.userId };
        delete newItem.userId;
        return newItem;
      });

    return res.status(200).json({
      success: true,
      posts: timelinePosts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllYourPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(403).json({ message: "Invalid User Id!" });
    }
    const posts = await Post.find({ userId: user._id });

    return res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid User Id!" });
    }
    const post = await Post.findById(req.body.postId);
  
    if (!post) {
      return res.status(400).json({ message: "Invalid Post Id!" });
    }

    if (post.likes.includes(req.user.userId)) {
      await Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user.userId },
      });
      res.status(200).json({
        success: true,
        message: "Post unliked Successfully!",
      });
    } else {
      await Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user.userId },
      });
      res.status(200).json({
        success: true,
        message: "Post liked Successfully!",
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
