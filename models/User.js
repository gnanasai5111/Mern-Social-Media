import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
    },
    city: {
      type: String,
    },
    gender: {
      type: Number,
      enum: [1, 2, 3],
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    birthday: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
