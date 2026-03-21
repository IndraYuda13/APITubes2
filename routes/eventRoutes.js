const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventController");
const { jwtRequired, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * {
 * "tags": [ { "name": "Events", "description": "Jadwal Kegiatan Masjid" } ],
 * "/api/events": {
 * "get": {
 * "tags": ["Events"],
 * "summary": "Lihat Agenda Kegiatan",
 * "responses": { "200": { "description": "List events" } }
 * },
 * "post": {
 * "tags": ["Events"],
 * "summary": "Tambah Event (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "title": { "type": "string" },
 * "subtitle": { "type": "string" },
 * "datetime": { "type": "string", "example": "2025-01-20 19:00" },
 * "location": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "201": { "description": "Event berhasil dibuat" } }
 * }
 * },
 * "/api/events/{id}": {
 * "put": {
 * "tags": ["Events"],
 * "summary": "Edit Event (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "title": { "type": "string" },
 * "subtitle": { "type": "string" },
 * "datetime": { "type": "string", "example": "2025-01-20 19:00" },
 * "location": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "200": { "description": "Update sukses" } }
 * },
 * "delete": {
 * "tags": ["Events"],
 * "summary": "Hapus Event (Admin Only)",
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
router.delete("/:id", jwtRequired, adminOnly, controller.deleteEvent);

module.exports = router;