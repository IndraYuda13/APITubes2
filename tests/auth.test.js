const request = require("supertest");
const app = require("../server");
const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Auth Controller Unit Tests (WBT-IND-001, WBT-IND-002, WBT-SHE-002)", () => {
  beforeEach(async () => {
    // Bersihkan tabel user setiap kali test case dijalankan
    await User.destroy({ where: {}, truncate: true, cascade: true });
  });

  // WBT-IND-001: Register Tests
  describe("POST /api/register (WBT-IND-001)", () => {
    test("P1 - Data tidak lengkap (Email kosong)", async () => {
      const res = await request(app)
        .post("/api/register")
        .send({ password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Data tidak lengkap");
    });

    test("P1 - Data tidak lengkap (Password kosong)", async () => {
      const res = await request(app)
        .post("/api/register")
        .send({ email: "user@mail.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Data tidak lengkap");
    });

    test("P2 - Email sudah terdaftar", async () => {
      // Setup existing user
      const hashed = await bcrypt.hash("password123", 10);
      await User.create({
        email: "existing@mail.com",
        password: hashed,
        name: "Existing User",
        role: "user",
      });

      const res = await request(app)
        .post("/api/register")
        .send({ email: "existing@mail.com", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email sudah terdaftar");
    });

    test("Success - Registrasi berhasil", async () => {
      const res = await request(app)
        .post("/api/register")
        .send({ email: "newuser@mail.com", password: "password123", name: "New User" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Registrasi berhasil");

      const saved = await User.findOne({ where: { email: "newuser@mail.com" } });
      expect(saved).not.toBeNull();
      expect(saved.name).toBe("New User");
    });
  });

  // WBT-IND-002: Login Tests
  describe("POST /api/login (WBT-IND-002)", () => {
    test("P1 - User tidak ditemukan (Email salah)", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ email: "unknown@mail.com", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Email atau password salah");
    });

    test("P2 - Password salah", async () => {
      const hashed = await bcrypt.hash("correctpassword", 10);
      await User.create({
        email: "user@mail.com",
        password: hashed,
        name: "Test User",
        role: "user",
      });

      const res = await request(app)
        .post("/api/login")
        .send({ email: "user@mail.com", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Email atau password salah");
    });

    test("Success - Login berhasil", async () => {
      const hashed = await bcrypt.hash("correctpassword", 10);
      await User.create({
        email: "user@mail.com",
        password: hashed,
        name: "Test User",
        role: "user",
      });

      const res = await request(app)
        .post("/api/login")
        .send({ email: "user@mail.com", password: "correctpassword" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login berhasil");
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe("user@mail.com");
    });
  });

  // WBT-SHE-002: updateProfile Tests
  describe("PUT /api/profile (WBT-SHE-002)", () => {
    test("P1 - User tidak ditemukan (JWT sub merujuk ke user non-existent)", async () => {
      // Kita generate token JWT untuk user ID fiktif
      const fakeToken = jwt.sign({ sub: "9999", role: "user" }, JWT_SECRET_KEY);

      const res = await request(app)
        .put("/api/profile")
        .set("Authorization", `Bearer ${fakeToken}`)
        .send({ name: "Sheila Amanda" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User tidak ditemukan");
    });

    test("P2 - Update data valid (Success)", async () => {
      const hashed = await bcrypt.hash("password123", 10);
      const user = await User.create({
        email: "sheila@mail.com",
        password: hashed,
        name: "Sheila",
        role: "user",
      });

      const token = jwt.sign({ sub: String(user.id), role: user.role }, JWT_SECRET_KEY);

      const res = await request(app)
        .put("/api/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Sheila Amanda", phone: "0812345678", address: "Bandung" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Profil berhasil diperbarui");
      expect(res.body.user.name).toBe("Sheila Amanda");
      expect(res.body.user.phone).toBe("0812345678");
      expect(res.body.user.address).toBe("Bandung");
    });
  });
});
