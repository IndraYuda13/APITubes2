const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { userToDict } = require("../utils/helpers");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "admin123!@#secretkeyAwokawokawok";
const JWT_EXPIRES_IN = "7d";

exports.register = async (req, res) => {
  const data = req.body || {};
  if (!data.email || !data.password) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) {
    return res.status(400).json({ message: "Email sudah terdaftar" });
  }

  const hashed = await bcrypt.hash(String(data.password), 10);
  await User.create({
    email: data.email,
    password: hashed,
    name: data.name || "User",
    phone: data.phone || "",
    role: "user",
  });

  return res.status(201).json({ message: "Registrasi berhasil" });
};

exports.login = async (req, res) => {
  const data = req.body || {};
  const user = await User.findOne({ where: { email: data.email } });
  if (user && (await bcrypt.compare(String(data.password || ""), user.password))) {
    const token = jwt.sign({ sub: String(user.id), role: user.role }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.status(200).json({
      message: "Login berhasil",
      token,
      user: userToDict(user),
    });
  }
  return res.status(401).json({ message: "Email atau password salah" });
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json(userToDict(user));
  } catch (error) {
    return res.status(500).json({ message: "Gagal mengambil data profil", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, address, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    return res.status(200).json({
      message: "Profil berhasil diperbarui",
      user: userToDict(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Gagal update profil", error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: "Harap isi password lama dan password baru" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(String(current_password), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const hashedNew = await bcrypt.hash(String(new_password), 10);
    user.password = hashedNew;
    await user.save();

    return res.status(200).json({ message: "Password berhasil diubah" });
  } catch (error) {
    return res.status(500).json({ message: "Gagal update password", error: error.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file yang diupload" });
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    const photoUrl = `uploads/${req.file.filename}`;
    user.profile_photo = photoUrl;
    await user.save();
    return res.status(200).json({
      message: "Foto profil berhasil diubah",
      user: userToDict(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Gagal upload foto", error: error.message });
  }
};