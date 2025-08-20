const express = require("express");
const { allBookings } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/all-bookings", auth, role("admin"), allBookings);

module.exports = router;
