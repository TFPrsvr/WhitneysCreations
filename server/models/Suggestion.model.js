const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Suggestion Schema
const SuggestionSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },

  description: { 
    type: String, 
    required: true 
  },

  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Reference to the user
  // createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
});

const Suggestion = mongoose.model('Suggestion', SuggestionSchema);
module.exports = Suggestion;
