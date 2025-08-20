const Booking = require("../models/Booking");

exports.allBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("slotId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
