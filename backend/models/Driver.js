const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  licenseStatus: { 
    type: String, 
    enum: ['Valid', 'Suspended', 'Expired'], 
    default: 'Valid' 
  },
  status: { 
    type: String, 
    enum: ['Available', 'On Trip', 'Off Duty'], 
    default: 'Available' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
