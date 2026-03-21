const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { User, Event, Room, Announcement, sequelize } = require("../models");

async function ensureBookingQuantityColumn() {
  const [cols] = await sequelize.query("PRAGMA table_info(booking);");
  const hasQuantity = Array.isArray(cols) && cols.some((c) => c.name === "quantity");
  if (!hasQuantity) {
    console.log("Migrasi: Menambahkan kolom quantity...");
    await sequelize.query("ALTER TABLE booking ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;");
  }
}

async function runSeed() {
  await ensureBookingQuantityColumn();

  // Seed Admin
  const adminEmail = "admin@gmail.com";
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });
  if (!existingAdmin) {
    console.log("Seeding Admin...");
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      email: adminEmail,
      password: hashed,
      name: "Super Admin",
      role: "admin",
      phone: "0000000000",
    });
  }

  // Seed Events, Rooms, dll (Salin logika if count === 0 dari file lama ke sini)
  // ...
}

module.exports = { runSeed };