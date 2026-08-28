import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "username already exist"],
      required: true,
    },
    email: {
      type: String,
      unique: [true, "User already exist"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User=mongoose.model("User",userSchema)

export default User
