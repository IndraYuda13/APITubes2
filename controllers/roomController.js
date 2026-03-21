const { Room } = require("../models");

exports.getAll = async (req, res) => {
  const rooms = await Room.findAll();
  return res.status(200).json(rooms);
};

exports.create = async (req, res) => {
  const data = req.body;
  const room = await Room.create(data);
  return res.status(201).json({ message: "Ruangan dibuat", data: room });
};

exports.update = async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ message: "Ruangan tidak ada" });
  await room.update(req.body);
  return res.status(200).json({ message: "Ruangan diupdate", data: room });
};

exports.deleteRoom = async (req, res) => {
  const room = await Room.findByPk(req.params.id);
  if (!room) return res.status(404).json({ message: "Ruangan tidak ada" });
  await room.destroy();
  return res.status(200).json({ message: "Ruangan dihapus" });
};