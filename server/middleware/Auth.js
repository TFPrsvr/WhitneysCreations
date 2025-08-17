const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const User = require('../models/User.model')
const UserController = require('../controllers/UserControllers')

module.exports = 

Auth = (req, res, next) => {
   const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Extract token from the Authorization header
   console.log('Received token in backend:', token);
//  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization not allowed'})
  }
  // const decoded =
  JWT.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({msg: 'Invalid or expired token'})
    }
  }) 
    // .then(decoded => {
      // console.log('Decoded token expiration:', decoded.exp)
      // console.log('Decoded token:', decoded);

      // return 
      User.findById(decoded._id)
    // })
    .then(user => {
      console.log('User found:', user)
      console.log('decoded:', decoded.user._id)
      if(!user) {
        return res.status(401).json({msg: 'user not found', error: err.message})
      }
      req.user = decoded
      next()
    }) 
    .catch((err) => {
      console.log('Error finding user:', err)
      return res.status(401).json({msg: 'Invalid token', error: err.message})
    })
 }

 

 


