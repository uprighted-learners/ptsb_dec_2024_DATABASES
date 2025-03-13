import express from "express";

import Post from "../models/post.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  
  try {
    let post = new Post({
      text: req.body.text,
      user_id: req.user._id,
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
    // let deletedPost = await Post.findByIdAndDelete(req.params.postId);

    let deletedPost = await Post.findOneAndDelete({_id: req.params.postId, user_id: req.user._id })

    if(!deletedPost) throw new Error("Unable to delete post")

    res.status(200).json({
        Deleted: deletedPost
    })
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

router.patch("/update/:postId", async (req, res) => {
  try{

      let newPost = req.body

      let updatePost = await Post.findOneAndUpdate({_id: req.params.postId, user_id: req.user._id }, newPost, {new: true})

      if(!updatePost) throw new Error("Can't update post")

      res.status(200).json({
        Updated: updatePost
      })

  }catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
})

export default router;
