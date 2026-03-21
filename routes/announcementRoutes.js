const express = require("express");
const router = express.Router();
const controller = require("../controllers/announcementController");
const { jwtRequired, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * {
 * "tags": [ { "name": "Announcements", "description": "Pengumuman Masjid" } ],
 * "/api/announcements": {
 * "get": {
 * "tags": ["Announcements"],
 * "summary": "Lihat Pengumuman",
 * "responses": { "200": { "description": "List pengumuman" } }
 * },
 * "post": {
 * "tags": ["Announcements"],
 * "summary": "Buat Pengumuman (Admin Only)",
 * "security": [ { "Bearer": [] } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "title": { "type": "string" },
 * "subtitle": { "type": "string" },
 * "tag": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "201": { "description": "Pengumuman berhasil dibuat" } }
 * }
 * },
 * "/api/announcements/{id}": {
 * "put": {
 * "tags": ["Announcements"],
 * "summary": "Edit Pengumuman (Admin Only)",
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
 * "tag": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "200": { "description": "Update sukses" } }
 * },
 * "delete": {
 * "tags": ["Announcements"],
 * "summary": "Hapus Pengumuman (Admin Only)",
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
router.delete("/:id", jwtRequired, adminOnly, controller.deleteAnnouncement);

module.exports = router;