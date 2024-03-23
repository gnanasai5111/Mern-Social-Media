import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const generateAccessToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1hr",
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_REFRESH_KEY, {
    expiresIn: "7d",
  });
};
export const registerUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email Already Exists" });
    }

    const hashedPassword = bcryptjs.hashSync(req.body.password, 10);

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePicture: req.file?.filename || "",
    });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const { password, ...rest } = user._doc;
    const data = { ...rest, accessToken, refreshToken };
    res
      .status(200)
      .json({ success: true, message: "User Created Successfully", ...data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "User Does not exist!" });
    }

    const isPasswordValid = await bcryptjs.compare(
      req.body.password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }

    const accessToken = generateAccessToken(existingUser._id);
    const refreshToken = generateRefreshToken(existingUser._id);
    const { password, ...rest } = existingUser._doc;

    const data = { ...rest, accessToken, refreshToken };
    res
      .status(200)
      .json({ success: true, message: "Successfully Logged In", ...data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


