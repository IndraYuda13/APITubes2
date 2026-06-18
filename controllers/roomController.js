const request = require("supertest");
const app = require("../server");
const { User, Room } = require("../models");

// Bungkus route room dengan try-catch agar ketika database crash dia mengembalikan status 500
// Ini untuk mensupport test case P2 WBT-SUB-001 secara konsisten

exports.getAll = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    return res.status(200).json(rooms);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    const room = await Room.create(data);
    return res.status(201).json({ message: "Ruangan dibuat", data: room });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Ruangan tidak ada" });
    await room.update(req.body);
    return res.status(200).json({ message: "Ruangan diupdate", data: room });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Ruangan tidak ada" });
    await room.destroy();
    return res.status(200).json({ message: "Ruangan dihapus" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
