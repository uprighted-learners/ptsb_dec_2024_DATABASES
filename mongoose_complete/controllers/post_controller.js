import express from "express";

import Post from "../models/post.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    let post = new Post({
      text: req.body.text,
      user_id: req.body.userid,
    });

    const newPost = await post.save();

    res.status(200).json({
      Created: newPost,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
      text: "ewr",
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    let results = await Post.find()
      .populate("user_id", ["firstName", "lastName", "-_id"])
      .select({ text: 1, createdAt: 1, updatedAt: 1 });

    res.status(200).json({
      Results: results,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.delete("/delete/:postId", async (req, res) => {
  try {
    let deletedPost = await Post.findByIdAndDelete(req.params.postId);

    res.status(200).json({
        Deleted: deletedPost
    })
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

export default router;
