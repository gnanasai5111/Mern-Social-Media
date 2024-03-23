import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!chatId) {
      res.status(500).json({ message: "Incorrect chat Id" });
    }

    const newMessage = await Message.create({
      content,
      chat: chatId,
      sender: req.user.userId,
    });

    const message = await Message.findById(newMessage._id)
      .populate("sender", "-password -followers -followings")
      .populate("chat");

    const createdNotification = await Notification.create({
      users: message?.chat?.users?.filter(
        (i) => i.toHexString() !== message?.sender?._id?.toHexString()
      ),
      message: `New message from ${
        message?.chat?.isGroupChat
          ? message?.chat?.chatName
          : message?.sender?.username
      }`,
      chat: chatId,
    });

    const notification = await Notification.findById(createdNotification._id)
      .populate("users", "-password -followers -followings")
      .populate("chat")
      .sort({ updatedAt: -1 });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
    return res
      .status(200)
      .json({ success: true, message: message, notification: notification});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "-password -followers -followings")
      .populate("chat");
    return res.status(200).json({ success: true, message: messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
