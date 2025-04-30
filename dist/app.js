"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const publicationRoutes_1 = __importDefault(require("./routes/publicationRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const opportunityRoutes_1 = __importDefault(require("./routes/opportunityRoutes"));
const announcementRoutes_1 = __importDefault(require("./routes/announcementRoutes"));
const blogsRoutes_1 = __importDefault(require("./routes/blogsRoutes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// In Express (Node.js)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use("/api", authRoutes_1.default);
app.use("/api", contactRoutes_1.default);
app.use("/api", teamRoutes_1.default);
app.use("/api", publicationRoutes_1.default);
app.use("/api", announcementRoutes_1.default);
app.use("/api", opportunityRoutes_1.default);
app.use("/api", blogsRoutes_1.default);
exports.default = app;
