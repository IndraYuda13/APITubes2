const express = require("express");
const router = express.Router();
const controller = require("../controllers/inventoryController");
const { jwtRequired, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * {
 * "tags": [ { "name": "Inventory", "description": "Manajemen Barang Inventaris" } ],
 * "/api/inventory": {
 * "get": {
 * "tags": ["Inventory"],
 * "summary": "Lihat Semua Barang",
 * "responses": { "200": { "description": "List data barang" } }
 * },
 * "post": {
 * "tags": ["Inventory"],
 * "summary": "Tambah Barang (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "name": { "type": "string" },
 * "category": { "type": "string" },
 * "stock": { "type": "integer" },
 * "description": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "201": { "description": "Barang berhasil ditambahkan" } }
 * }
 * },
 * "/api/inventory/{id}": {
 * "put": {
 * "tags": ["Inventory"],
 * "summary": "Edit Barang (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "name": { "type": "string" },
 * "category": { "type": "string" },
 * "stock": { "type": "integer" },
 * "description": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "200": { "description": "Sukses update" } }
 * },
 * "delete": {
 * "tags": ["Inventory"],
 * "summary": "Hapus Barang (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "responses": { "200": { "description": "Sukses hapus" } }
 * }
 * }
 * }
 */
router.get("/", controller.getAll);
router.post("/", jwtRequired, adminOnly, controller.create);
router.put("/:id", jwtRequired, adminOnly, controller.update);
router.delete("/:id", jwtRequired, adminOnly, controller.deleteItem);

module.exports = router;