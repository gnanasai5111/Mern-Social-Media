import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./theme/themeSlice";
import loginReducer from "./login/loginSlice";
import authReducer from "./auth/authSlice";
import signupReducer from "./signup/signupSlice";
import userReducer from "./user/userSlice";
import postReducer from "./post/postSlice";
import commentReducer from "./comment/commentSlice";
import chatReducer from "./chat/chatSlice";
import messageReducer from "./message/messageSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  login: loginReducer,
  signup: signupReducer,
  auth: authReducer,
  user: userReducer,
  post: postReducer,
  comment: commentReducer,
  chat: chatReducer,
  message: messageReducer,
});

const store = configureStore({ reducer: rootReducer });

export default store;
