

import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
// import path from 'path';
import fs from "fs";
import path from "path";
import cron from "node-cron";
import axios from "axios";

cron.schedule("*/10 * * * *", async () => {
  try {
    await axios.get("https://your-backend.onrender.com");
    console.log("Pinged self to stay awake");
  } catch (err) {
    console.error("Ping failed", err);
  }
});

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


// const corsOptions: cors.CorsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Or specify your frontend origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(cors({
  origin: '*', // Your React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
// In Express (Node.js)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
