const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const User = require('../models/User.model')
const UserController = require('../controllers/UserControllers')

module.exports = 


Auth2 = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    console.log('Received token in middleware:', token);
  
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization not allowed' });
    }
  
    // Use Promise-based verification
    JWT.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
            return res.status(401).json({msg: 'Token expired, please login again', err: err.message})
        }
        return res.status(401).json({msg: 'Invalid/Expired token,'})
    } 
    User.findById(decoded._id)
    .then(user => {
        console.log('Decoded token:', decoded); // Log the decoded token
        if(!user) {
            return res.status(401).json({msg: 'User not found'})
        }
        console.log('decoded._id:', user)
        // .then(decoded => {
            console.log('Decoded token in middleware:', decoded)
            req.user = decoded; // Attach the decoded token to the request
            next(); // Proceed to the next middleware/route handler
        })
        .catch(err => {
            console.log('Error finding user:', err);
            return res.status(500).json({ msg: 'Error finding user', err: err.message });
        })
    });
// )
        // })
        // .catch(err => {
        //     console.log('Error decoding token:', err);
        //     return res.status(403).json({ msg: 'Invalid or expired token', error: err.message });
        // });
  };