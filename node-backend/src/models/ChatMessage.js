const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  room_id: {
    type: String,
    required: true,
    index: true,
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text',
  },
  read: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
