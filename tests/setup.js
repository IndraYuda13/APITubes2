const { sequelize } = require("../models");

beforeAll(async () => {
  // Sync database in-memory secara force sebelum testing dimulai
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close database connection setelah suite selesai
  await sequelize.close();
});
