const Suggestion = require('../models/Suggestion.model')
const jwt = require('jsonwebtoken');
const Auth2 = require('../middleware/Authenticate')
const bcrypt = require('bcrypt')
const SECRET_KEY = process.env.SECRET_KEY
const mongoose = require("mongoose")

module.exports = {

  
  createSuggestion: (req, res) => {

   const { title, description } = req.body;
  // const token = req.headers.authorization.split(" ")[1]; 
  console.log('Incoming request headers:', req.headers)
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  console.log('Received token in backend:', token)
  console.log('Authorization header:', req.headers.authorization);
  console.log('Form data:', req.body)

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'No token, Unauthorized' })
    }
    console.log('decoded token:', decoded)

    const userId = decoded._id; 
    console.log('Decoded userId:', userId)

    const newSuggestion = new Suggestion({
      title,
      description,
      user: userId 
    });

    newSuggestion.save()
      .then(savedSuggestion => {
        console.log('new saved suggestion:', savedSuggestion)
        res.status(201).json(savedSuggestion);
      })
      .catch(err => {
        console.log('Error saving suggestion:', err.message)
        res.status(500).json({ message: 'Error creating suggestion', error: err.message });
      });
  })
  // .catch(err => {
  //   console.log('Error verifying token:', err)
  //   res.status(403).json({msg: 'Invalid or expired token', err: err.message})
  // })
},

  updateSuggestion: (req, res) => {

  const suggestionId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
    return res.status(400).json({msg: 'Invalid suggestion ID for update'})
  }
  const suggestions = req.body
  console.log('upSugg req.body:', req.body, suggestions)
  const { title, description } = req.body;
  console.log('Incoming request headers for updateSugg:', req.headers)
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log('upSuggestionId:', req.params.id)
  console.log('up Title:')
  console.log('up Description:')
  console.log('upSugg token:', token)
  console.log('upSugg token received in backend:', token)
  console.log('Authorization header:', req.headers.authorization);

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Unauthorized' });
    const userId = decoded._id
    console.log('upSugg decoded token:', decoded)
    console.log('upSugg userId:', userId)

    // const payload = [{
    // title = suggestion.title, 
    // description = suggestion.description, 
    // user = suggestion.userId
    // }]

    const suggestionIdObj = new mongoose.Types.ObjectId(suggestionId)
    console.log('suggestionId for upSugg:', suggestionId, suggestionIdObj)


    Suggestion.findOne({ 
      _id: suggestionIdObj,
      user: userId 
    })
          .then(suggestion => {
        console.log('upd suggestion:', suggestionIdObj)
        if (!suggestion) return res.status(404).json({ message: 'Suggestion not found or unauthorized' });

        console.log('upSugg Decoded userId:', decoded._id);
        console.log('upSugg Suggestion userId:', suggestion.user.toString())

        if (suggestion.user.toString() !== userId.toString())
          {
            console.log('Not Authed to upSugg:', userId, suggestionId)
        
           return res.status(403).json({msg: 'Unauthorized User, Cannot Update Suggestion'})
          }
          suggestion.title = title
          suggestion.description = description

        suggestion.save()
          .then(updated => {
            console.log('upSugg Updated Suggestion:', updated)
            res.status(200).json(updated);
          })
          .catch(err => {
            console.log('upSugg Error updating suggestion:', err.message)
            res.status(500).json({ message: 'Error updating suggestion', error: err });
          });
      })
      .catch(err => {
        console.log('upSugg Error finding suggestion:', err.message)
        res.status(500).json({ message: 'Error finding suggestion', error: err });
      });
  });
},

  deleteSuggestion: (req, res) => {
    // const suggestion = suggestion._id && suggestion._id.toString()
    // console.log(suggestion)
    const suggestions = req.body
    console.log('delSuggs req.body:', req.body, suggestions)

  const suggestionId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(suggestionId)) {
    return res.status(400).json({msg: 'Invalid suggestion ID for delete'})
  }
  // console.log('Incoming request headers:', req.headers)

  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log('token received in backend:', token)
  if (!token) return res.status(403).json({ message: 'Token missing or malformed' });
  // console.log('Authorization header:', req.headers.authorization);


  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Unauthorized' });
    console.log('delSugg Decoded token:', decoded)
    const userId = decoded._id
    console.log('delSugg userId:', userId)

    const suggestionIdObj = new mongoose.Types.ObjectId(suggestionId)


    console.log('delSugg suggestion Id Object:', suggestionIdObj)
    console.log('suggestionId for delSugg:', suggestionId, suggestionIdObj)

    

    //  Suggestion.findById({suggestionId, userId}) 

    Suggestion.findOne({ 
      _id: suggestionIdObj,
      user: userId  
    })
    .then((suggestion) => {
      console.log('delSugg Suggestion:', suggestionIdObj)
      if (!suggestion) return res.status(404).json({ message: 'delSugg not found for deletion,' });

      console.log('delSugg Decoded userId:', decoded._id);
      console.log('delSugg Suggestion userId:', suggestion.user.toString())
      
      if(suggestion.user.toString() !== userId.toString()) {
               // if(suggestion.user.toString() !== decoded.id) { ** !== 1/24/25
      
          // if (suggestion.user.toString() !== decoded._id.toString()){  ** !== 1/24/25
          console.log('Not Authed to delSugg:', userId, suggestionId)
        return res.status(401).json({msg: 'Not Authorized to delete suggestion'})
      } 
      
      Suggestion.deleteOne({ _id: suggestionIdObj})
      .then(() => {
        console.log('delSugg deleted successfully:', suggestionIdObj)
        return res.status(200).json({msg: 'Suggestion deleted successfully'})
      })
      .catch(err => {
        console.log('Error during deletion:', err)
        res.status(500).json({ message: 'Error deleting suggestion', error: err });
      });
    })
    .catch(err => {
      console.log('Error finding delSuggestion:', err)
      return res.status(400).json({msg: 'Error Finding Suggestion', err: err.message})
    })
  })
 },


 
 getSuggestions: (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; 
  console.log('Incoming request headers:', req.headers)
  console.log('Token from headers for backend:', token);
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
}
console.log('Authorization header:', req.headers.authorization);


  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Unauthorized' })
      console.log('decoded token:', decoded)
    const userId = decoded._id
    console.log('userId:', userId)
    
      Suggestion.find({user: userId})  
      .then(suggestions => {
          console.log('Fetched suggestions:', suggestions);
          res.json({suggestions, token});
      })
      .catch(err => {
          console.log('Error fetching suggestions:', err.message);
          res.status(500).json({ message: 'Error fetching suggestions', error: err.message });
      });
 })
}

}
