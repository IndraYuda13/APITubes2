const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { jwtRequired, adminOnly } = require("../middleware/authMiddleware");

/**
 * @swagger
 * {
 * "tags": [ { "name": "Bookings", "description": "Peminjaman Barang & Ruangan" } ],
 * "/api/bookings": {
 * "get": {
 * "tags": ["Bookings"],
 * "summary": "Lihat Daftar Peminjaman (User lihat punya sendiri, Admin lihat semua)",
 * "security": [ { "Bearer": [] } ],
 * "responses": { "200": { "description": "List booking" } }
 * },
 * "post": {
 * "tags": ["Bookings"],
 * "summary": "Ajukan Peminjaman",
 * "security": [ { "Bearer": [] } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "type": { "type": "string", "example": "inventory" },
 * "item_id": { "type": "integer" },
 * "start_time": { "type": "string", "example": "2025-01-01 08:00" },
 * "end_time": { "type": "string", "example": "2025-01-01 10:00" },
 * "quantity": { "type": "integer" },
 * "notes": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "201": { "description": "Pengajuan berhasil" } }
 * }
 * },
 * "/api/bookings/{id}/status": {
 * "put": {
 * "tags": ["Bookings"],
 * "summary": "Update Status Booking (Admin Approve/Reject)",
 * "security": [ { "Bearer": [] } ],
 * "parameters": [ { "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } } ],
 * "requestBody": {
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "status": { "type": "string", "enum": ["approved", "rejected", "completed", "pending"] }
 * }
 * }
 * }
 * }
 * },
 * "responses": { "200": { "description": "Status berubah & Stok update otomatis" } }
 * }
 * }
 * }
 */
router.post("/", jwtRequired, bookingController.createBooking);
router.get("/", jwtRequired, bookingController.getAllBookings);
router.put("/:id/status", jwtRequired, adminOnly, bookingController.updateStatus);

module.exports = router;