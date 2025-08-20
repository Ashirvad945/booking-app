const express = require("express");
const { getSlots, bookSlot, myBookings } = require("../controllers/bookingController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/slots", auth, getSlots);
router.post("/book", auth, bookSlot);
router.get("/my-bookings", auth, myBookings);

module.exports = router;
