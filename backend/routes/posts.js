const express = require("express");
const { Post } = require("../models");
const { verifyToken } = require("../utils/auth");
const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { userId, caption, imageUrl } = req.body;

  try {
    const newPost = await Post.create({ userId, caption, imageUrl });
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.destroy({ where: { id: postId } });

    if (post) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Post not found." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
});

router.get("/user/:userId", verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const userPosts = await Post.findAll({ where: { userId } });
    res.json(userPosts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching user posts." });
  }
});

module.exports = router;
