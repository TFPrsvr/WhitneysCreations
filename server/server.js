const express = require("express");
const app = express();

// Force Railway redeploy for suggestions auth fix
const cors = require("cors"); 
const mongoose = require("mongoose");

require("dotenv").config();

// Debug environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  console.error("Current working directory:", process.cwd());
  console.error("Available environment variables:", Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('SECRET') || key.includes('PORT')));
  process.exit(1);
}

const port = process.env.PORT || 3002;

const Router = require("./routes/routes");

const cookieParser = require('cookie-parser')

// CORS must come FIRST before any other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "https://whitneys-creations.vercel.app",
        "https://whitneyscreations.vercel.app"
      ];

      // Check if origin matches allowed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check if origin matches any Vercel deployment pattern
      if (origin.includes('vercel.app') &&
          (origin.includes('whitneys-creations') || origin.includes('whitneyscreations'))) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
  })
);

// Body parsers come AFTER CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));


// Improved error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
      message: 'The provided ID is not valid'
    });
  }
  
  if (err.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: 'A record with this information already exists'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
})



Router(app);

app.listen(port, () => {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log("✅ Connected to MongoDB Database");
  }).catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });

  console.log(`🚀 Server is running on port: ${port}`);
});