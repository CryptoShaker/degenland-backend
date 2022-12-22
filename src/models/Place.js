const mongoose = require('mongoose');
const PlaceSchema = new mongoose.Schema({
  address: {
    type: String,
    default: ''
  },
  pos: {
    type: String,
    default: ''
  },
  token_id: {
    type: String,
    required: true
  },
  serialNumber: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  buildingCount: {
    type: Number, 
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  totalVisitor: {
    type: Number,
    default: 0,
  },
  currentVisitor: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('Place', PlaceSchema);
