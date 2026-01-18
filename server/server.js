import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

// Import routes
import records from "./routes/record.js";
import authRoutes from "./routes/auth.js";

// Import passport config
import passportConfig from "./config/passport.js";

// Load environment variables
dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 5050;
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.ATLAS_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Session middleware (must be before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
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
app.use("/record", records);
app.use("/auth", authRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Eatelligent API is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});