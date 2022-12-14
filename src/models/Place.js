const mongoose = require('mongoose');
const PlaceSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  pos: {
    type: String,
    required: true
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
    required: true
  },
  buildingCount: {
    type: Number, 
    default: 0,
    required: true
  },
  score: {
    type: Number,
    default: 0,
    required: true
  },
  totalVisitor: {
    type: Number,
    default: 0,
    required: true
  },
  currentVisitor: {
    type: Number,
    default: 0,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('Place', PlaceSchema);
