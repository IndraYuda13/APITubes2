const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const authController = require("../controllers/authController");
const { jwtRequired } = require("../middleware/authMiddleware");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, "user-" + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }
});

/**
 * @swagger
 * {
 * "tags": [
 * {
 * "name": "Authentication",
 * "description": "Manajemen Login dan Register"
 * }
 * ]
 * }
 */

/**
 * @swagger
 * {
 * "/api/register": {
 * "post": {
 * "summary": "Daftar User Baru",
 * "tags": ["Authentication"],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "email": { "type": "string" },
 * "password": { "type": "string" },
 * "name": { "type": "string" },
 * "phone": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "201": { "description": "User berhasil dibuat" }
 * }
 * }
 * }
 * }
 */
router.post("/register", authController.register);

/**
 * @swagger
 * {
 * "/api/login": {
 * "post": {
 * "summary": "Login User",
 * "tags": ["Authentication"],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "email": { "type": "string", "example": "admin@gmail.com" },
 * "password": { "type": "string", "example": "admin123" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "200": { "description": "Login berhasil" }
 * }
 * }
 * }
 * }
 */
router.post("/login", authController.login);

/**
 * @swagger
 * {
 * "/api/profile": {
 * "get": {
 * "summary": "Ambil data profile user login",
 * "tags": ["Authentication"],
 * "security": [{ "bearerAuth": [] }],
 * "responses": {
 * "200": { "description": "Data user berhasil diambil" }
 * }
 * },
 * "put": {
 * "summary": "Update data profile (Nama, Email, Address, dll)",
 * "tags": ["Authentication"],
 * "security": [{ "bearerAuth": [] }],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "name": { "type": "string" },
 * "email": { "type": "string" },
 * "phone": { "type": "string" },
 * "address": { "type": "string" },
 * "role": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "200": { "description": "Update berhasil" }
 * }
 * }
 * }
 * }
 */
router.get("/profile", jwtRequired, authController.getProfile);
router.put("/profile", jwtRequired, authController.updateProfile);

/**
 * @swagger
 * {
 * "/api/profile/password": {
 * "put": {
 * "summary": "Ganti Password",
 * "tags": ["Authentication"],
 * "security": [{ "bearerAuth": [] }],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "application/json": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "current_password": { "type": "string" },
 * "new_password": { "type": "string" }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "200": { "description": "Password berhasil diubah" }
 * }
 * }
 * }
 * }
 */
router.put("/profile/password", jwtRequired, authController.updatePassword);

/**
 * @swagger
 * {
 * "/api/profile/photo": {
 * "post": {
 * "summary": "Upload/Update Foto Profil",
 * "tags": ["Authentication"],
 * "security": [{ "bearerAuth": [] }],
 * "requestBody": {
 * "required": true,
 * "content": {
 * "multipart/form-data": {
 * "schema": {
 * "type": "object",
 * "properties": {
 * "photo": {
 * "type": "string",
 * "format": "binary"
 * }
 * }
 * }
 * }
 * }
 * },
 * "responses": {
 * "200": { "description": "Foto profil berhasil diupload" }
 * }
 * }
 * }
 * }
 */
router.post("/profile/photo", jwtRequired, upload.single("photo"), authController.uploadPhoto);

module.exports = router;