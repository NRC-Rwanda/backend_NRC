"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import path from 'path';
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Ensure the uploads directory exists
const uploadsDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
(0, db_1.default)().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
// import cors from 'cors';
// const corsOptions: cors.CorsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// };
app_1.default.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true
}));
// In Express (Node.js)
app_1.default.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
