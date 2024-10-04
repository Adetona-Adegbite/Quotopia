const express = require("express");
const router = express.Router();
const { Like, Post } = require("../models");
const { verifyToken } = require("../utils/auth");

router.post("/:postId/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = await Like.create({
      userId: req.userId,
      postId: req.params.postId,
    });
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: "Error liking post" });
  }
});

router.delete("/:postId/unlike", verifyToken, async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { postId: req.params.postId, userId: req.userId },
    });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();
    res.status(200).json({ message: "Unliked the post successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unliking post" });
  }
});

module.exports = router;
