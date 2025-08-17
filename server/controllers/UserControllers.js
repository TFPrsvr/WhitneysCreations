const User = require("../models/User.model");
const Auth = require("../middleware/Auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY

module.exports = {
  getTest: (req, res) => {
    console.log("TESTING!!!");
    console.log('Test', req.body)
    res.json({ msg: "Hi HRU" });
  },

   generateToken:  (userId) => {
      return JWT.sign(
        { id: userId },
        process.env.JWT_SECRET, 
        { expiresIn: '2h' } 
      );
    },
    

  registerUser: (req, res) => {
    console.log("Registering:", req.body);

    const { first_name, last_name, username, email, password } = req.body;
    
    // Check if the password and other required fields are provided
    if (!password || !first_name || !last_name || !username || !email) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    User.findOne({ $or: [{ email }, { username }] })
        .then((existingUser) => {
            if (existingUser) {
                console.log("User already exists");
                return res.status(400).json({ msg: "User already exists. Please login" });
            }

            // If user does not exist, proceed with registration
            console.log("User IS NEW");

            // Hash the password
            bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    // Create new user with the hashed password
                    const newUser = new User({
                        first: first_name,
                        last: last_name,
                        username: username,
                        email: email,
                        password: hashedPassword,
                    });

                    console.log("New User:", newUser);

                    // Save the new user to the database
                    newUser.save()
                        .then((savedUser) => {
                            console.log('User saved:', savedUser);

                            // Create JWT payload with user information
                            const payload = {
                                user: {
                                    firstName: savedUser.first,
                                    lastName: savedUser.last,
                                    username: savedUser.username,
                                    email: savedUser.email,
                                    _id: savedUser._id,
                                }
                            };

                            // Sign the JWT token with a secret key
                            const token = JWT.sign(payload, process.env.SECRET_KEY, { expiresIn: '2h' });

                            console.log('Token:', token);

                            // Set the token as a secure, HTTP-only cookie
                            res.cookie('jwt', token, {
                                httpOnly: true,
                                secure: true, // Set to true if using HTTPS
                                maxAge: 3600000, // 1 hour
                            });

                            // Respond with success and user info
                            res.status(200).json({
                                msg: 'User registered successfully',
                                user: savedUser,
                            });
                        })
                        .catch((err) => {
                            console.log('Error saving user:', err.message);
                            res.status(500).json({ msg: 'Error saving user', error: err.message });
                        });
                })
                .catch((err) => {
                    console.error('Error hashing password:', err.message);
                    res.status(500).json({ msg: 'Error hashing password', error: err.message });
                });
        })
        .catch((err) => {
            console.error('Error checking existing user:', err.message);
            res.status(500).json({ msg: 'Error checking existing user', error: err.message });
        });

        
  },

      
      // Refresh token to extend session
      refreshToken: (req, res) => {
        try {
          // Get current user from authenticated request
          const userId = req.user.id;
          
          // Generate new token with 2-hour expiration
          const payload = {
            id: userId,
            iat: Date.now()
          };
          
          const newToken = JWT.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "2h",
          });
          
          console.log("Token refreshed for user:", userId);
          
          res.status(200).json({
            success: true,
            token: newToken,
            message: "Token refreshed successfully"
          });
          
        } catch (error) {
          console.error("Token refresh error:", error);
          res.status(401).json({
            success: false,
            message: "Token refresh failed"
          });
        }
      },
      
      loginUser: (req, res) => {
        // const user = {username: username, password: password, _id: user._id}
  
        const { username, password, _id } = req.body;

        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
    
        // User.findOne({ username: username }).then((user) => {  ****1st  try 
          User.findOne({ username: trimmedUsername }).then((user) => {   //2nd try
// @ 2 is successful
            // User.findOne({ username: { $regex: '^' + trimmedUsername + '$', $options: 'i' } })
// ****3rd try if 2 doesn't work
          console.log("Req body:", req.body);
          console.log("Found user:", user); 
        if (!user) {
            return res.status(400).json({ msg: "Invalid User Not Found" });
        }
    
        // const match = bcrypt.compareSync(password, user.password); ** 1st try 
           const match = bcrypt.compareSync(trimmedPassword, user.password)
        console.log("Password match result:", match);  
    
        if (!match) {
            return res.status(400).json({ msg: "Invalid/Bad Credentials" });
        }
    
        const payload = {
          username: user.username,
          _id: user._id,  
      };
        console.log("payload:", payload);  
        console.log('_id:', user._id)
        console.log('username:', user.username)
    
        const token = JWT.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "2h",
        });
    
        console.log("token", token);

        // Update login info
        user.updateLoginInfo();
    
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000,
        })
        .status(200)
        .json({ 
            message: "Logged in successfully", 
            token: token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                first: user.first,
                last: user.last,
                role: user.role,
                fullName: user.fullName
            }
        });
    })
    .catch(err => {
        console.error('Error comparing passwords:', err.message);
        res.status(500).json({ msg: 'Internal Server Error or Incorrect Credentials' });
    });
    
      },


     getUser: (req, res) => {
        // Access user data from the request object (added by authMiddleware)
        const userEmail = req.user.email;
      
        // Find the user in the database
        const user = users.find((user) => user.email === userEmail);
        if (!user) {
          return res.status(404).json({ message: 'User   not found' });
        }
      
        // Return the user's data (excluding sensitive information like password)
        const userData = { username: user.username, email: user.email };
        res.status(200).json({ message: 'User   data fetched successfully', user: userData });
      },
   

      getProfile: (req, res) => {
        const userEmail = req.user.email;
      
        // Find the user in the database
        const user = users.find((user) => user.email === userEmail);
        if (!user) {
          return res.status(404).json({ message: 'User   not found' });
        }
      
        // Return the user's profile data
        const profileData = {
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePicture: user.profilePicture,
        };
        res.status(200).json({ message: 'Profile data fetched successfully', profile: profileData });
      },
      
      

      // Get user profile (requires authentication)
      getUserProfile: async (req, res) => {
        try {
          const userId = req.user._id;
          const user = await User.findById(userId).select('-password');
          
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'User not found'
            });
          }

          res.status(200).json({
            success: true,
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              first: user.first,
              last: user.last,
              role: user.role,
              fullName: user.fullName,
              profile: user.profile,
              addresses: user.addresses,
              lastLogin: user.lastLogin,
              createdAt: user.createdAt
            }
          });

        } catch (error) {
          console.error('Error fetching user profile:', error);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile'
          });
        }
      },

      logout: (req, res) => {
        res.clearCookie("jwt");
        res.status(200).json({ msg: "Logged out successfully" });
      },

    }
      
      




 

