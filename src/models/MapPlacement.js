const mongoose = require('mongoose');
const MapPlacementSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true
  },
  placementstring: {
    type: String, 
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model('MapPlacement', MapPlacementSchema);
