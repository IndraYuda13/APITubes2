const request = require("supertest");
const app = require("../server");
const { User, Room } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Room Controller Unit Tests (WBT-SUB-001, WBT-SUB-002)", () => {
  let adminToken;

  beforeEach(async () => {
    await Room.destroy({ where: {}, truncate: true, cascade: true });
    await User.destroy({ where: {}, truncate: true, cascade: true });

    const hashed = await bcrypt.hash("password123", 10);
    const testAdmin = await User.create({
      email: "admin@mail.com",
      password: hashed,
      name: "Admin User",
      role: "admin",
    });
    adminToken = jwt.sign({ sub: String(testAdmin.id), role: testAdmin.role }, JWT_SECRET_KEY);
  });

  // WBT-SUB-001: create
  describe("POST /api/rooms (WBT-SUB-001)", () => {
    test("P1 - Ruangan berhasil dibuat (Success)", async () => {
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Ruang Utama", capacity: 500 });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Ruangan dibuat");
      expect(res.body.data.name).toBe("Ruang Utama");
    });

    test("P2 - Database constraint / Server Error", async () => {
      // Kita coba memicu sequelize error dengan mengirimkan parameter yang melanggar tipe data (seperti capacity berupa object array kompleks)
      const res = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: { nested: "invalid" }, capacity: "not-a-number" });

      // Sequelize atau SQLite akan gagal memproses string ke integer kapasitas atau invalid tipe data name
      // Dan controller kita membiarkan exception ditangkap global / me-return error (jika error terjadi, pastikan handling mengembalikan error)
      // Note: Di Express default jika controller crash tanpa try-catch, ia akan return status 500
      expect(res.status).toBe(500);
    });
  });

  // WBT-SUB-002: update
  describe("PUT /api/rooms/:id (WBT-SUB-002)", () => {
    test("P1 - Ruangan tidak ditemukan", async () => {
      const res = await request(app)
        .put("/api/rooms/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Aula Baru" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Ruangan tidak ada");
    });

    test("P2 - Update sukses (Success)", async () => {
      const room = await Room.create({ name: "Ruang Rapat", capacity: 20 });

      const res = await request(app)
        .put(`/api/rooms/${room.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ capacity: 40 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Ruangan diupdate");

      const updated = await Room.findByPk(room.id);
      expect(updated.capacity).toBe(40);
    });
  });
});
