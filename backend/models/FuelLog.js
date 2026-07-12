const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  liters: { type: Number, required: true },
  cost: { type: Number, required: true },
  odometer: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FuelLog', fuelLogSchema);
