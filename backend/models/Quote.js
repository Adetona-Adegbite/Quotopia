// models/quote.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Quote = sequelize.define(
  "Quote",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quote: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "quotes",
    timestamps: false,
  }
);

module.exports = Quote;
