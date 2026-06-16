const { Sequelize } = require("sequelize");

const sequelize = process.env.DB_HOST 
  ? new Sequelize(process.env.DB_NAME || "simasu_db", process.env.DB_USER || "simasu_user", process.env.DB_PASS || "simasu_pass", {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT || 3306,
      logging: false,
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: "simasu.db",
      logging: false,
    });

module.exports = sequelize;