const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: { code: "INVALID_INPUT", message: "name, email, password required" } });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: { code: "EMAIL_EXISTS", message: "Email already registered" } });
    }
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, role: "patient" });
    return res.status(201).json({ message: "User registered" });
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return res.status(200).json({ token, role: user.role });
  } catch (err) {
    return res.status(500).json({ error: { code: "SERVER_ERROR", message: err.message } });
  }
};
