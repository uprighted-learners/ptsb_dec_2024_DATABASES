import mongoose from "mongoose";

import User from "./user.js";

const PostSchema = new mongoose.Schema(
  {
    text: {
        type: String,
        required: true,
        minlength: 5
    },
    user_id: {
        type: mongoose.ObjectId,
        required: true,
        ref: User
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("post", PostSchema)
