const express = require("express");

const router = express.Router();
const { User } = require("../models");
const { verifyToken } = require("../utils/auth");

router.put("/update-preferences", verifyToken, async (req, res) => {
  const { notificationsEnabled, userId } = req.body;
  console.log(notificationsEnabled, userId);
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notificationsEnabled = notificationsEnabled;
    await user.save();

    return res
      .status(200)
      .json({ message: "Preferences updated successfully" });
  } catch (error) {
    console.error("Error updating preferences:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
