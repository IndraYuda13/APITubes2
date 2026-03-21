const { Booking, User, Inventory, sequelize } = require("../models");
const { bookingToDict, parseDateTimeStrict } = require("../utils/helpers");

exports.createBooking = async (req, res) => {
  const userId = req.user.id;
  const data = req.body || {};

  const startDt = parseDateTimeStrict(data.start_time);
  const endDt = parseDateTimeStrict(data.end_time);
  if (!startDt || !endDt) {
    return res.status(400).json({ message: "Format tanggal salah. Gunakan YYYY-MM-DD HH:MM" });
  }

  const quantity = Number(data.quantity ?? 1);
  if (quantity < 1) return res.status(400).json({ message: "Quantity minimal 1" });

  if (data.type === "inventory") {
    const item = await Inventory.findByPk(data.item_id);
    if (!item) return res.status(404).json({ message: "Barang tidak ditemukan" });
    if (Number(item.stock) < quantity) return res.status(400).json({ message: "Stok kurang" });
  }

  await Booking.create({
    user_id: userId,
    type: data.type,
    item_id: data.item_id,
    item_name: data.item_name,
    start_time: startDt,
    end_time: endDt,
    quantity,
    notes: data.notes,
    status: "pending",
  });

  return res.status(201).json({ message: "Pengajuan berhasil" });
};

exports.getAllBookings = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const where = role === "admin" ? {} : { user_id: userId };

  const bookings = await Booking.findAll({
    where,
    include: [{ model: User, attributes: ["name"] }],
    order: [["start_time", "DESC"]],
  });

  return res.status(200).json(bookings.map(bookingToDict));
};

exports.updateStatus = async (req, res) => {
  const id = Number(req.params.id);
  const newStatus = req.body?.status;
  const allowed = ["approved", "rejected", "completed", "pending"];
  
  if (!allowed.includes(newStatus)) return res.status(400).json({ message: "Status tidak valid" });

  const t = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(id, { transaction: t });
    if (!booking) {
      await t.rollback();
      return res.status(404).json({ message: "Booking tidak ditemukan" });
    }

    if (booking.type === "inventory") {
      const item = await Inventory.findByPk(booking.item_id, { transaction: t });
      if (!item) {
        await t.rollback();
        return res.status(404).json({ message: "Barang hilang dari DB" });
      }
      const qty = Math.max(1, Number(booking.quantity));

      // Logika Stok
      if (newStatus === "approved" && booking.status !== "approved") {
        if (Number(item.stock) < qty) {
          await t.rollback();
          return res.status(400).json({ message: "Stok tidak cukup!" });
        }
        item.stock = Number(item.stock) - qty;
        item.status = item.stock <= 0 ? "Habis" : "Tersedia";
        await item.save({ transaction: t });
      } else if (booking.status === "approved" && newStatus !== "approved") {
        item.stock = Number(item.stock) + qty;
        item.status = "Tersedia";
        await item.save({ transaction: t });
      }
    }

    booking.status = newStatus;
    await booking.save({ transaction: t });
    await t.commit();
    return res.status(200).json({ message: `Status diubah ke ${newStatus}` });
  } catch (e) {
    await t.rollback();
    return res.status(500).json({ message: "Server error", error: e.message });
  }
};