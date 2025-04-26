

import app from "./app";
import connectDB from "./config/db";
import dotenv from "dotenv";
import cors from 'cors';
import express from 'express';
// import path from 'path';
import fs from "fs";
import path from "path";

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
// import cors from 'cors';

// const corsOptions: cors.CorsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };

app.use(cors({
  origin: 'http://localhost:3000', // Your React app's URL
  credentials: true
}));
// In Express (Node.js)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
