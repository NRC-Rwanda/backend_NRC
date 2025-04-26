import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import path from "path";
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";
import publicationRoutes from "./routes/publicationRoutes";
import teamRoutes from "./routes/teamRoutes";
import opportunityRoutes from "./routes/opportunityRoutes";
import announcementRoutes from "./routes/announcementRoutes";
import blogRoutes from "./routes/blogsRoutes";

const app = express();

// Middleware
app.use(cors()); 
app.use(helmet());
app.use(morgan("dev")); 
app.use(express.json());
// In Express (Node.js)
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", teamRoutes);
app.use("/api", publicationRoutes);
app.use("/api", announcementRoutes);
app.use("/api", opportunityRoutes);
app.use("/api", blogRoutes);

export default app;