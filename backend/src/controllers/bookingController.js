const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const ensureSlots = require("../utils/ensureSlots");
const { toUTCDate } = require("../utils/date");

exports.getSlots = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: { code: "INVALID_INPUT", message: "from and to required" } });
    }
    await ensureSlots(from, to);

    const start = toUTCDate(from);
    const end = new Date(toUTCDate(to).getTime() + 24 * 60 * 60 * 1000 - 1);

    const slots = await Slot.find({ startAt: { $gte: start, $lte: end } }).sort({ startAt: 1 });
    const booked = await Booking.find({ slotId: { $in: slots.map(s => s._id) } }).select("slotId");
    const bookedSet = new Set(booked.map(b => String(b.slotId)));

    const available = slots.filter(s => !bookedSet.has(String(s._id)));

    return res.json({ slots: available });
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    if (!slotId) return res.status(400).json({ error: { code: "INVALID_INPUT", message: "slotId required" } });

    const slot = await Slot.findById(slotId);
    if (!slot) return res.status(404).json({ error: { code: "NOT_FOUND", message: "Slot not found" } });

    try {
      const booking = await Booking.create({ userId: req.user.id, slotId: slot._id });
      return res.status(201).json({ message: "Booked", bookingId: booking._id });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ error: { code: "SLOT_TAKEN", message: "This slot is already booked" } });
      }
      throw e;
    }
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate("slotId").sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
