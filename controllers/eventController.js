const { Event } = require("../models");
const { parseDateTimeStrict } = require("../utils/helpers");

exports.getAll = async (req, res) => {
  const events = await Event.findAll({ order: [["event_date", "ASC"]] });
  return res.status(200).json(events);
};

exports.create = async (req, res) => {
  const data = req.body;
  const dateObj = parseDateTimeStrict(data.datetime);
  if (!data.title || !dateObj) return res.status(400).json({ message: "Judul/Tanggal salah" });

  await Event.create({
    title: data.title,
    subtitle: data.subtitle,
    event_date: dateObj,
    location: data.location,
  });
  return res.status(201).json({ message: "Event dibuat" });
};

exports.update = async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

  const data = req.body;
  
  if (data.title) event.title = data.title;
  if (data.subtitle) event.subtitle = data.subtitle;
  if (data.location) event.location = data.location;
  
  if (data.datetime) {
    const dateObj = parseDateTimeStrict(data.datetime);
    if (!dateObj) return res.status(400).json({ message: "Format tanggal salah" });
    event.event_date = dateObj;
  }

  await event.save();
  return res.status(200).json({ message: "Event diupdate", data: event });
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event tidak ditemukan" });

  await event.destroy();
  return res.status(200).json({ message: "Event dihapus" });
};