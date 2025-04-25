import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

const app = express();
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

// CORS Configuration for multiple frontends (main app and admin dashboard)
const allowedOrigins = [
  "https://frontend-eosin-kappa-58.vercel.app",  // Main frontend
  "https://admin-yourdomain.vercel.app"         // Admin frontend (replace with your actual URL)
];

app.use(cors({
  origin: function (origin, callback) {
    // If there's no origin (e.g., server-to-server request) or the origin is allowed, continue
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allow cookies (if you're using them)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests (OPTIONS requests)
app.options("*", cors());

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// Simple test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start the server
app.listen(port, () => console.log(`Server started on PORT:${port}`));
