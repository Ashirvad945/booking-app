const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);
app.use("/api", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: { code: "SERVER_ERROR", message: "Unexpected error" } });
});

module.exports = app;
