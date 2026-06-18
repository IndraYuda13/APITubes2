const request = require("supertest");
const app = require("../server");
const { User, Inventory, Booking, sequelize } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Booking Controller Unit Tests (WBT-SHE-001, WBT-ASL-001, WBT-ASL-002)", () => {
  let userToken, adminToken, testUser, testAdmin, testItem;

  beforeEach(async () => {
    // Truncate tables
    await Booking.destroy({ where: {}, truncate: true, cascade: true });
    await Inventory.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    // Seed test user
    const hashed = await bcrypt.hash("password123", 10);
    testUser = await User.create({
      email: "user@mail.com",
      password: hashed,
      name: "Normal User",
      role: "user",
    });
    userToken = jwt.sign({ sub: String(testUser.id), role: testUser.role }, JWT_SECRET_KEY);

    // Seed test admin
    testAdmin = await User.create({
      email: "admin@mail.com",
      password: hashed,
      name: "Admin User",
      role: "admin",
    });
    adminToken = jwt.sign({ sub: String(testAdmin.id), role: testAdmin.role }, JWT_SECRET_KEY);

    // Seed test inventory item
    testItem = await Inventory.create({
      name: "Sajadah Masjid",
      category: "Equipment",
      stock: 10,
      status: "Tersedia",
    });
  });

  // WBT-ASL-001 & WBT-ASL-002: createBooking
  describe("POST /api/bookings (WBT-ASL-001 / WBT-ASL-002)", () => {
    test("P1 - Format tanggal salah (invalid start_time)", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          type: "inventory",
          item_id: testItem.id,
          quantity: 1,
          start_time: "invalid-date",
          end_time: "2026-06-20 10:00",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Format tanggal salah. Gunakan YYYY-MM-DD HH:MM");
    });

    test("P2 - Quantity kurang dari 1", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          type: "inventory",
          item_id: testItem.id,
          quantity: 0,
          start_time: "2026-06-20 08:00",
          end_time: "2026-06-20 10:00",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Quantity minimal 1");
    });

    test("Success - Booking barang valid", async () => {
      const res = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          type: "inventory",
          item_id: testItem.id,
          item_name: testItem.name,
          quantity: 2,
          start_time: "2026-06-20 08:00",
          end_time: "2026-06-20 10:00",
          notes: "Kajian",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Pengajuan berhasil");

      const bookings = await Booking.findAll();
      expect(bookings.length).toBe(1);
      expect(bookings[0].quantity).toBe(2);
    });
  });

  // WBT-SHE-001: updateStatus
  describe("PUT /api/bookings/:id/status (WBT-SHE-001)", () => {
    test("P1 - Status tidak valid", async () => {
      const res = await request(app)
        .put("/api/bookings/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "invalid_status" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Status tidak valid");
    });

    test("P2 - Booking tidak ditemukan", async () => {
      const res = await request(app)
        .put("/api/bookings/9999/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Booking tidak ditemukan");
    });

    test("Success - Approve status dan kurangi stok barang", async () => {
      // Buat booking pending terlebih dahulu
      const booking = await Booking.create({
        user_id: testUser.id,
        type: "inventory",
        item_id: testItem.id,
        item_name: testItem.name,
        start_time: new Date(),
        end_time: new Date(),
        quantity: 3,
        status: "pending",
      });

      const res = await request(app)
        .put(`/api/bookings/${booking.id}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "approved" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Status diubah ke approved");

      // Cek stok barang ter-update (dari 10 berkurang 3 menjadi 7)
      const updatedItem = await Inventory.findByPk(testItem.id);
      expect(updatedItem.stock).toBe(7);
      expect(updatedItem.status).toBe("Tersedia");
    });
  });
});
