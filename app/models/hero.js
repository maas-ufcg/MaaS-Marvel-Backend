const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema defines how the user's data will be stored in MongoDB
const HeroSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
    // besides the mongodb default _id field, there is the id field from marvel
  },
  name: {
      type: String, 
      required: true
  },
  description: {
      type: String,
  }, 
  modified: {
      type: String,
      required: true
  }, 
  thumbnail: {
    path: {
        type: String
    }, 
    extension: {
        type: String
    }
  }

});

module.exports = mongoose.model('Hero', HeroSchema);