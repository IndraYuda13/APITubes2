const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomController");
const { jwtRequired, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * {
 * "tags": [ { "name": "Rooms", "description": "Manajemen Ruangan" } ],
 * "/api/rooms": {
 * "get": {
 * "tags": ["Rooms"],
 * "summary": "Lihat Semua Ruangan",
 * "responses": { "200": { "description": "List ruangan" } }
 * },
 * "post": {
 * "tags": ["Rooms"],
 * "summary": "Tambah Ruangan (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "name": { "type": "string" },
 * "floor": { "type": "string" },
 * "capacity": { "type": "integer" },
 * "facilities": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "201": { "description": "Ruangan berhasil ditambahkan" } }
 * }
 * },
 * "/api/rooms/{id}": {
 * "put": {
 * "tags": ["Rooms"],
 * "summary": "Edit Ruangan",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "responses": { "200": { "description": "Update sukses" } }
 * },
 * "delete": {
 * "tags": ["Rooms"],
 * "summary": "Hapus Ruangan",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "responses": { "200": { "description": "Hapus sukses" } }
 * }
 * }
 * }
 */
router.get("/", controller.getAll);
router.post("/", jwtRequired, adminOnly, controller.create);
router.put("/:id", jwtRequired, adminOnly, controller.update);
router.delete("/:id", jwtRequired, adminOnly, controller.deleteRoom);

module.exports = router;