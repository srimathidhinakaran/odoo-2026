const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  referenceModel: { type: String, required: true }, // 'Vehicle' or 'Driver'
  docType: { type: String, required: true },
  fileBase64: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
