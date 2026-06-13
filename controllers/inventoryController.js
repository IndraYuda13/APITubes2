const { Inventory } = require("../models");

exports.getAll = async (req, res) => {
  const items = await Inventory.findAll();
  return res.status(200).json(items);
};

exports.create = async (req, res) => {
  const data = req.body || {};
  const stock = Number(data.stock ?? 0);
  const item = await Inventory.create({
    name: data.name,
    category: data.category,
    stock,
    description: data.description,
    status: stock > 0 ? "Tersedia" : "Habis",
  });
  return res.status(201).json({ message: "Barang ditambah", data: item });
};

exports.update = async (req, res) => {
  const item = await Inventory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });

  const data = req.body || {};
  if (data.name !== undefined) item.name = data.name;
  if (data.category !== undefined) item.category = data.category;
  if (data.stock !== undefined) item.stock = Number(data.stock);
  if (data.description !== undefined) item.description = data.description;
  
  item.status = item.stock > 0 ? "Tersedia" : "Habis";
  await item.save();
  return res.status(200).json({ message: "Update sukses", data: item });
};

exports.deleteItem = async (req, res) => {
  const item = await Inventory.findByPk(req.params.id);
  if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });
  await item.destroy();
  return res.status(200).json({ message: "Barang dihapus" });
};