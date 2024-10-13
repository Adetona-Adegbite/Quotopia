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

    const existingLike = await Like.findOne({
      where: {
        postId: req.params.postId,
        userId: req.body.userId,
      },
    });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    await Like.create({
      userId: req.body.userId,
      postId: req.params.postId,
    });

    const likeCount = await Like.count({
      where: { postId: req.params.postId },
    });

    res.status(201).json({ message: "Post liked", likeCount });
  } catch (error) {
    res.status(500).json({
      message: "Error liking post",
      error,
    });
  }
});

router.post("/:postId/unlike", verifyToken, async (req, res) => {
  try {
    const like = await Like.findOne({
      where: { postId: req.params.postId, userId: req.body.userId },
    });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    await like.destroy();

    const likeCount = await Like.count({
      where: { postId: req.params.postId },
    });

    res
      .status(200)
      .json({ message: "Unliked the post successfully", likeCount });
  } catch (error) {
    res.status(500).json({
      message: "Error unliking post",
      error,
    });
  }
});

module.exports = router;
