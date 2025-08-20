// require("dotenv").config();
// const connectDB = require("./config/db");
// const app = require("./app");
// const seedAdmin = require("./seed/seedAdmin");

// const PORT = process.env.PORT || 5000;

// connectDB().then(async () => {
//   await seedAdmin();
//   app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
// });




import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
