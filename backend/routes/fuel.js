const express = require('express');
const router = express.Router();
const FuelLog = require('../models/FuelLog');

// Get all fuel logs
router.get('/', async (req, res) => {
  try {
    const logs = await FuelLog.find().populate('vehicle');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add fuel log
router.post('/', async (req, res) => {
  try {
    const newLog = new FuelLog(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
