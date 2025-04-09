import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes";
import contactRoutes from "./routes/contactRoutes";
// import publicationRoutes from "./routes/publicationRoutes";
import teamRoutes from "./routes/teamRoutes";

const app = express();

// Middleware
app.use(cors()); 
app.use(helmet());
app.use(morgan("dev")); 
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", teamRoutes);
// app.use("/api/publications", publicationRoutes);

export default app;