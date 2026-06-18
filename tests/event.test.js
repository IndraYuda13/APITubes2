const request = require("supertest");
const app = require("../server");
const { User, Event } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Event Controller Unit Tests (WBT-HAI-002)", () => {
  let adminToken;

  beforeEach(async () => {
    await Event.destroy({ where: {}, truncate: true, cascade: true });
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

  describe("POST /api/events (WBT-HAI-002)", () => {
    test("P1 - Format tanggal salah", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Kajian Rutin",
          datetime: "invalid-date-format",
          location: "Masjid Syamsul Ulum",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Judul/Tanggal salah");
    });

    test("P2 - Judul kosong", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          datetime: "2026-06-20 09:00",
          location: "Masjid Syamsul Ulum",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Judul/Tanggal salah");
    });

    test("Success - Event berhasil dibuat", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Kajian Rutin",
          subtitle: "Tema: Tauhid",
          datetime: "2026-06-20 09:00",
          location: "Masjid Syamsul Ulum",
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Event dibuat");

      const saved = await Event.findAll();
      expect(saved.length).toBe(1);
      expect(saved[0].title).toBe("Kajian Rutin");
    });
  });
});
