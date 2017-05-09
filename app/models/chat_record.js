const mongoose = require('mongoose');

// Schema defines how the user's data will be stored in MongoDB
const ChatRecordSchema = new mongoose.Schema({
  heroId: {
    type: String,
    required: true
    // chat room id = hero id
  },
  type: {
      type: String, 
      enum: ['message', 'notification'],
      default: 'message'
  },
  from: {
    type: String, 
    required: true
  }, 
  message: {
      type: String,
      required: true
  }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatRecord', ChatRecordSchema);