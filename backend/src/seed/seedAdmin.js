const bcrypt = require("bcrypt");
const User = require("../models/User");

async function seedAdmin() {
  const email = "admin@example.com";
  const exists = await User.findOne({ email });
  if (exists) return;
  const hashed = await bcrypt.hash("Passw0rd!", 10);
  await User.create({ name: "Admin", email, password: hashed, role: "admin" });
  console.log("✅ Seeded default admin (admin@example.com / Passw0rd!)");
}

module.exports = seedAdmin;
