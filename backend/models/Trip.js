const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  cargoWeight: { type: Number, required: true }, // in kg
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  revenue: { type: Number, required: true },
  fuelCost: { type: Number, default: 0 },
  dispatchTime: { type: Date },
  completionTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
