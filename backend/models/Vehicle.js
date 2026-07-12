const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['Truck', 'Van', 'Car'], required: true },
  status: { 
    type: String, 
    enum: ['Available', 'On Trip', 'In Shop', 'Out of Service'], 
    default: 'Available' 
  },
  capacityWeight: { type: Number, required: true }, // in kg
  acquisitionCost: { type: Number, required: true },
  currentMileage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
