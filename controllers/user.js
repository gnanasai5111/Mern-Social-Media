import User from "../models/User.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res) => {
  try {
    if (req.user?.userId === req.params.id || req.user?.isAdmin) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User Doesnt exist" });
      }
      if (req.body.password) {
        const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
        req.body.password = hashedPassword;
      }
      let data = !req.file?.filename
        ? req.body
        : { ...req.body, profilePicture: req.file?.filename };
      await User.findByIdAndUpdate(req.params.id, { $set: data });
      const updatedUser = await User.findById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Your account has Updated Successfully",
        user: updatedUser,
      });
    } else {
      return res
        .status(403)
        .json({ message: "You can  update only your account" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.user?.userId === req.params.id || req.user?.isAdmin) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User Doesnt exist" });
      }
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Your account has Deleted Successfully",
      });
    } else {
      return res
        .status(403)
        .json({ message: "You can delete only your account" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Doesnt exist" });
    }
    const { password, ...rest } = user._doc;
    res.status(200).json({
      success: true,
      ...rest,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    let formattedUsers = users.map((user) => {
      return {
        _id: user._id,
        profilePicture: user.profilePicture,
        username: user.username,
        birthday: user?.birthday,
        city: user?.city,
        desc: user?.desc,
        gender: user?.gender,
        relationship: user?.relationship,
      };
    });

    res.status(200).json({
      success: true,
      users: formattedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleFriend = async (req, res) => {
  const friendId = req.params.id;
  const userId = req.user.userId;
  if (userId !== friendId) {
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User or friend does not exist" });
    }

    const isFollowing = user.followings.includes(friendId);
    if (isFollowing) {
      await User.findByIdAndUpdate(userId, {
        $pull: { followings: friendId },
      });
      await User.findByIdAndUpdate(friendId, {
        $pull: { followers: userId },
      });
      res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(userId, {
        $push: { followings: friendId },
      });
      await User.findByIdAndUpdate(friendId, {
        $push: { followers: userId },
      });
      res.status(200).json({ message: "Followed successfully" });
    }
  } else {
    return res
      .status(403)
      .json({ message: "You cant follow or unfollow yourself " });
  }

  try {
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
