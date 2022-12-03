const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  walletid: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  targetPos: {
    type: String, 
    required: true
  },
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  movingState: {
    type: Boolean,
    required: true
  },
  targetx: {
    type: Number
  },
  targety: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('User', UserSchema);
