const express = require("express");
const jwt = require('jsonwebtoken')
const app = express(); 

const cors = require("cors"); 
const mongoose = require("mongoose");

require("dotenv").config();

const bcrypt = require("bcrypt");

const port = process.env.PORT || 3002;

const Router = require("./routes/routes");

const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
  })
);


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
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to Database");
  });

  console.log(`Server is running on port: ${port} `);
});