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
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Explicitly allow cross-origin resources
}));
app.use(morgan("dev"));
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", 
  "https://nrc-frontend.vercel.app",
  // Add any other origins you need to allow
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.startsWith(allowedOrigin) ||
      new URL(origin).hostname === new URL(allowedOrigin).hostname
    )) {
      return callback(null, true);
    }
    
    const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Static files with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.join(', '));
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

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

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

export default app;