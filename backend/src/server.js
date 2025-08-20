require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");
const seedAdmin = require("./seed/seedAdmin");

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
});





