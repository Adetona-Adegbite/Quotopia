const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/register", upload.single("image"), async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const profilePicture = req.file ? req.file.path : null;

  try {
    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profile_pic: profilePicture,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    res.status(201).json({ accessToken, refreshToken, user: user.id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user: user.id });
  } else {
    res.sendStatus(403);
  }
});

router.post("/refresh-token", async (req, res) => {
  const { token } = req.body;
  const user = await User.findOne({ where: { refreshToken: token } });

  if (!user) return res.sendStatus(403);

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.sendStatus(403);

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
});

router.post("/logout", async (req, res) => {
  const { token } = req.body;
  await User.update({ refreshToken: null }, { where: { refreshToken: token } });
  res.sendStatus(204);
});

module.exports = router;
