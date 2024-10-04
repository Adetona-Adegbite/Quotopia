const sequelize = require("../config/db");
const User = require("./User");
const Post = require("./Post");
const Like = require("./Like");

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Like, { foreignKey: "userId", as: "likes" });
Post.hasMany(Like, { foreignKey: "postId", as: "likes" });
Like.belongsTo(User, { foreignKey: "userId", as: "user" });
Like.belongsTo(Post, { foreignKey: "postId", as: "post" });

const db = {
  sequelize,
  User,
  Post,
  Like,
};

module.exports = db;
