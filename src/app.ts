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
// app.use(cors()); 
app.use(helmet());
app.use(morgan("dev")); 
app.use(express.json());

// In your main app.js or server.js
app.use(cors({
  origin: 'https://nrc-frontend.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Make sure your static file serving has proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://nrc-frontend.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'uploads')));


// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
 
// Routes
app.use("/api", authRoutes);
app.use("/api", contactRoutes); 
app.use("/api", teamRoutes);
app.use("/api", publicationRoutes);
app.use("/api", announcementRoutes);
app.use("/api", opportunityRoutes);
app.use("/api", blogRoutes);

export default app;