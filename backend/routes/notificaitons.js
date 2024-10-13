const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const fetch = require("node-fetch");
const { verifyToken } = require("../utils/auth");
const { User } = require("../models");
const Sequelize = require("sequelize");
const Quote = require("../models/Quote");

router.post("/save-token", verifyToken, async (req, res) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    return res.status(400).json({ message: "Token and userId are required" });
  }

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.notificationToken = token;
    await user.save();

    return res.status(200).json({ message: "Token saved successfully" });
  } catch (error) {
    console.error("Error saving token:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while saving the token" });
  }
});

const getRandomQuote = async () => {
  try {
    const count = await Quote.count();
    const randomIndex = Math.floor(Math.random() * count);
    const randomQuote = await Quote.findOne({
      offset: randomIndex,
    });
    return randomQuote.quote;
  } catch (error) {
    console.error("Error fetching random quote:", error);
    return "Stay positive!";
  }
};

const sendNotification = async (token, title, body) => {
  const message = {
    to: token,
    sound: "default",
    title,
    body,
    data: { extraData: "Additional custom data" },
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("Notification result:", result);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

cron.schedule("* * * * *", async () => {
  console.log("Sending daily notifications at 8 AM...");

  try {
    const users = await User.findAll({
      where: {
        notificationToken: {
          [Sequelize.Op.ne]: null,
        },
        notificationsEnabled: true,
      },
    });

    for (const user of users) {
      const randomQuote = await getRandomQuote();
      console.log(randomQuote);
      //   console.log(user.notificationToken);
      sendNotification(user.notificationToken, "Good Morning!", randomQuote);
    }

    console.log("Notifications sent successfully.");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
});

module.exports = router;
