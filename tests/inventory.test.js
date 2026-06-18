const request = require("supertest");
const app = require("../server");
const { User, Inventory } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";

describe("Inventory Controller Unit Tests (WBT-DEV-001, WBT-DEV-002)", () => {
  let adminToken;

  beforeEach(async () => {
    await Inventory.destroy({ where: {}, truncate: true, cascade: true });
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

  // WBT-DEV-001: create
  describe("POST /api/inventory (WBT-DEV-001)", () => {
    test("P1 - Tambah barang, status 'Tersedia' (stok > 0)", async () => {
      const res = await request(app)
        .post("/api/inventory")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Karpet", category: "Alat", stock: 10, description: "Karpet Hijau" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Barang ditambah");
      expect(res.body.data.status).toBe("Tersedia");
    });

    test("P2 - Tambah barang, status 'Habis' (stok = 0)", async () => {
      const res = await request(app)
        .post("/api/inventory")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Speaker Rusak", category: "Alat", stock: 0, description: "Mati total" });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe("Barang ditambah");
      expect(res.body.data.status).toBe("Habis");
    });
  });

  // WBT-DEV-002: update
  describe("PUT /api/inventory/:id (WBT-DEV-002)", () => {
    test("P1 - Barang tidak ditemukan", async () => {
      const res = await request(app)
        .put("/api/inventory/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ stock: 5 });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Barang tidak ditemukan");
    });

    test("P2 - Update sukses, status 'Tersedia'", async () => {
      const item = await Inventory.create({
        name: "Mic",
        category: "Audio",
        stock: 0,
        status: "Habis",
      });

      const res = await request(app)
        .put(`/api/inventory/${item.id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ stock: 5 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Update sukses");
      expect(res.body.data.status).toBe("Tersedia");
    });
  });
});
