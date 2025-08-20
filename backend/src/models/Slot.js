const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  startAt: { type: Date, required: true },
  endAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

slotSchema.index({ startAt: 1, endAt: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
