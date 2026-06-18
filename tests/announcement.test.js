const request = require("supertest");
const app = require("../server");
const { User, Announcement } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Announcement Controller Unit Tests (WBT-HAI-001)", () => {
  let adminToken;

  beforeEach(async () => {
    await Announcement.destroy({ where: {}, truncate: true, cascade: true });
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

  describe("POST /api/announcements (WBT-HAI-001)", () => {
    test("P1 - Judul kosong", async () => {
      const res = await request(app)
        .post("/api/announcements")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ content: "Isi pengumuman tanpa judul" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Judul wajib");
    });

    test("P2/Success - Pengumuman berhasil dibuat", async () => {
      const res = await request(app)
        .post("/api/announcements")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ title: "Kajian Jumat", content: "Kajian rutin ba'da Ashar" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Pengumuman dibuat");

      const saved = await Announcement.findAll();
      expect(saved.length).toBe(1);
      expect(saved[0].title).toBe("Kajian Jumat");
    });
  });
});
