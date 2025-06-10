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
import donationRoutes from "./routes/donationRoutes";

const app = express();


// Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },// Allow cross-origin resource sharing
  }),
)
app.use(morgan("dev"))
app.use(express.json())

// Single CORS configuration
const allowedOrigins = ["http://localhost:3000", "https://nrc-frontend.vercel.app","https://nrc.org.rw","http://www.nrc.org.rw"]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin."
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["Content-Length", "Content-Type", "Authorization"],
  }),
)

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
app.use("/api", donationRoutes);

export default app;