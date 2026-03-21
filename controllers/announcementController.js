const { Announcement } = require("../models");

exports.getAll = async (req, res) => {
  const data = await Announcement.findAll({ order: [["id", "DESC"]] });
  return res.status(200).json(data);
};

exports.create = async (req, res) => {
  if (!req.body.title) return res.status(400).json({ message: "Judul wajib" });
  await Announcement.create(req.body);
  return res.status(201).json({ message: "Pengumuman dibuat" });
};

exports.update = async (req, res) => {
  const item = await Announcement.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });

  await item.update(req.body);
  return res.status(200).json({ message: "Pengumuman diupdate", data: item });
};

exports.deleteAnnouncement = async (req, res) => {
  const item = await Announcement.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Pengumuman tidak ditemukan" });

  await item.destroy();
  return res.status(200).json({ message: "Pengumuman dihapus" });
};