const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
} else if (process.env.DB_HOST) {
  sequelize = new Sequelize(
    process.env.DB_NAME || "simasu_db",
    process.env.DB_USER || "simasu_user",
    process.env.DB_PASS || "simasu_pass",
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      port: process.env.DB_PORT || 3306,
      logging: false,
    }
  );
} else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE || "simasu.db",
    logging: false,
  });
}

module.exports = sequelize;
