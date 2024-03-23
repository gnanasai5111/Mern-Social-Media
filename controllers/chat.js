import Chat from "../models/Chat.js";

export const accessChat = async (req, res) => {
  try {
    const receiverUserId = req.body.userId;
    const currentUserId = req.user.userId;
    if (!receiverUserId) {
      return res.status(400).json({ message: "Please send the receiver id!" });
    }
    const existingChat = await Chat.find({
      isGroupChat: false,
      users: { $all: [receiverUserId, currentUserId] },
    })
      .populate("users", "-password -followers -followings")
      .populate("latestMessage", "sender content");

   
    if (existingChat.length > 0) {
      return res.status(200).json({ success: true, data: existingChat[0] });
    }

    const chat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: false,
      users: [receiverUserId, currentUserId],
    });

    const newChat = await Chat.findById(chat._id)
      .populate("users", "-password -followers -followings")
      .populate("latestMessage");

    return res.status(200).json({ success: true, data: newChat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const allChats = await Chat.find({
      users: { $in: [currentUserId] },
    })
      .populate("users", "-password -followers -followings")
      .populate("latestMessage")
      .populate("groupAdmin", "username")
      .sort({ updatedAt: -1 });
    return res.status(200).json({ success: true, data: allChats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createGroupChat = async (req, res) => {

  try {
    if (req.body.users?.length < 2) {
      return res
        .status(400)
        .json({ message: "You need atleast a person to create a group" });
    }
    const chat = await Chat.create({
      chatName: req.body.chatName,
      isGroupChat: true,
      users: req.body.users,
      groupAdmin: req.user.userId,
    });
    const groupChat = await Chat.findById(chat._id)
      .populate("users", "-password -followers -followings")
      .populate("groupAdmin", "username");

    return res.status(200).json({ success: true, data: groupChat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const renameGroup = async (req, res) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $set: { chatName: req.body.chatName },
      },
      { new: true }
    )
      .populate("users", "-password -followers -followings")
      .populate("groupAdmin", "username");
    if (!updatedChat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedChat,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const removeFromGroup = async (req, res) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $pull: { users: req.body.userId },
      },
      { new: true }
    )
      .populate("users", "-password -followers -followings")
      .populate("groupAdmin", "username");
    if (!updatedChat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedChat,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addToGroup = async (req, res) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      req.body.chatId,
      {
        $push: { users: req.body.userId },
      },
      { new: true }
    )
      .populate("users", "-password -followers -followings")
      .populate("groupAdmin", "username");
    if (!updatedChat) {
      return res.status(400).json({ message: "Chat not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: updatedChat,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
