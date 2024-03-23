import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/post.js";
import commentRouter from "./routes/comment.js";
import storyRouter from "./routes/story.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";
import notificationRouter from "./routes/notification.js";
import path from "path";
import cors from "cors";
import { generateNewAccessAndRefreshTokens } from "./middleware/getNewToken.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;
const __dirname = path.resolve();
app.use(cors());
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// app.use(express.static(path.join(__dirname, "public/images")));

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);
app.use("/api/story", storyRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/notifications", notificationRouter);
// refresh token
app.post("/api/refresh", generateNewAccessAndRefreshTokens);

// -----------Deployment -----------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// -----------Deployment -----------------

db.on("open", () => {
  server.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`);
  });
});
db.on("error", (err) => {
  console.log(err);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("socket is connected", socket.id);

  socket.on("setup", (userId) => {
    socket.join(userId);
  });

  socket.on("send-message", (messageData, notificationData) => {
    let sender = messageData.sender;
    let chatusers = messageData.chat?.users;

    chatusers?.forEach((userId) => {
      if (sender._id !== userId) {
        socket
          .to(userId)
          .emit("receive-message", messageData, notificationData);
      }
    });
  });
});
