const mongoose = require('mongoose');
const BuildingSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  cost: { type: Number, required: true },
  default: { type: Boolean, required: true },
  size: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = User = mongoose.model('Building', BuildingSchema);
