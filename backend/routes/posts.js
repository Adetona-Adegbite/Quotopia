const express = require("express");
const { Post, User, Like } = require("../models");
const { verifyToken } = require("../utils/auth");
const moment = require("moment");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  console.log(page, limit);
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: "user" },
        { model: Like, as: "likes", attributes: ["userId"] },
      ],
      offset: (page - 1) * limit,
      limit: limit,
    });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    const postsWithDetails = posts.map((post) => {
      const timeAgo = moment(post.createdAt).fromNow();

      const likedByUser = post.likes.some((like) => like.userId === userId);

      return {
        ...post.toJSON(),
        timeAgo,
        likedByUser,
        likeCount: post.likes.length,
      };
    });
    console.log(postsWithDetails);
    res.json(postsWithDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { userId, caption, imageUrl } = req.body;

  try {
    const newPost = await Post.create({ userId, caption, imageUrl });
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
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
    console.log(error);

    res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
});
router.get("/user/:userId", verifyToken, async (req, res) => {
  const profileUserId = req.params.userId;
  const userId = req.user.id;

  try {
    const userPosts = await Post.findAll({
      where: { userId: profileUserId },
      include: [
        {
          model: User,
          as: "user",
        },
        {
          model: Like,
          as: "likes",
          attributes: ["userId"],
        },
      ],
    });

    const totalLikes = userPosts.reduce(
      (sum, post) => sum + post.likes.length,
      0
    );

    const postsWithDetails = userPosts.map((post) => {
      const timeAgo = moment(post.createdAt).fromNow();

      const likedByUser = post.likes.some((like) => like.userId === userId);

      return {
        ...post.toJSON(),
        timeAgo,
        likedByUser,
        likeCount: post.likes.length,
      };
    });

    res.json({
      userPosts: postsWithDetails,
      totalLikes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while fetching user posts and likes.",
    });
  }
});

module.exports = router;
