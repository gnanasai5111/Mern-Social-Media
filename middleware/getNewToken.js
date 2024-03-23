import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../controllers/auth.js";


export const generateNewAccessAndRefreshTokens = (req, res) => {
  const refreshToken = req.body.token;



  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is Invalid" });
    }

    const newAccessToken = generateAccessToken(user.userId);
    const newRefreshToken = generateRefreshToken(user.userId);
    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
};
