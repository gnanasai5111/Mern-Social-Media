import Story from "../models/Story.js";
import User from "../models/User.js";

export const createStory = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(403).json({ message: "User Doesnt exist!" });
    }
    const story = await new Story(req.body);
    await story.save();
    res
      .status(200)
      .json({ success: true, message: "Story Created Successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(403).json({ message: "User Doesnt exist!" });
    }
    const story = await Story.findById(req.params.storyId);
    if (!story) {
        return res.status(403).json({ message: "Story Doesnt exist!" });
      }
    if (story.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only Delete your story!" });
    } else {
      await Story.findByIdAndDelete(req.params.storyId);
      res
        .status(200)
        .json({ success: true, message: "Story Deleted Successfully!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllStory = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(403).json({ message: "User Doesnt exist!" });
    }
    const yourStories = await Story.find({ userId: req.body.userId });
    const frdStories = await Promise.all(
      user.followings.map((friendId) => {
        return Story.find({ userId: friendId });
      })
    );
    res
      .status(200)
      .json({ success: true, stories: [...yourStories, ...frdStories] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
