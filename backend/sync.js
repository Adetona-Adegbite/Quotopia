const db = require("./models");

const syncDatabase = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Database synced successfully!");
  } catch (error) {
    console.error("Error syncing database:", error);
  } finally {
    process.exit(0);
  }
};

syncDatabase();
