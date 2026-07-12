const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['In Progress', 'Completed'], 
    default: 'In Progress' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);
