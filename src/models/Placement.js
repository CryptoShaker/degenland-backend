const mongoose = require('mongoose');
const PlacementSchema = new mongoose.Schema({
  address: { type: String, required: true },
  pos: { type: Number, required: true },
  type: { type: String, required: true },
  built: { type: Boolean, required: true },
  remaintime: { type: Number, required: true },
  ads: { type: String },
  linkurl: { type: String },
  owner: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('Placement', PlacementSchema);
