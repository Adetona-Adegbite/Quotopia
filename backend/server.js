const express = require("express");
const sequelize = require("./config/db");
require("dotenv").config();
const app = express();
const postRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");
const likesRoutes = require("./routes/likes");

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/auth", authRoutes);
app.use("/like", likesRoutes);

sequelize
  .authenticate()
  .then(() => console.log("Connected to Supabase Postgres database"))
  .catch((err) => console.log("Error: " + err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
