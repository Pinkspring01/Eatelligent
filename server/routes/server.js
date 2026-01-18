import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
import records from "./routes/ingredient.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import recipeRoutes from "./routes/recipe.js";

// Import passport config
import passportConfig from "./config/passport.js";

const PORT = process.env.PORT || 5050;
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware - CORS MUST BE BEFORE ROUTES
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // Allow cookies and authorization headers
}));
app.use(express.json());

// Session middleware (must be before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passportConfig(passport);

// Routes
app.use("/ingredient", records);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/api", recipeRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Eatelligent API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});