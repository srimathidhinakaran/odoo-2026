const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// Get all maintenance logs
router.get('/', async (req, res) => {
  try {
    const logs = await Maintenance.find().populate('vehicle');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a maintenance log & update vehicle status
router.post('/', async (req, res) => {
  const { vehicleId, description, cost } = req.body;
  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    
    // Prevent maintenance on vehicles that are on trip
    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Cannot service a vehicle currently on a trip.' });
    }

    const log = new Maintenance({
      vehicle: vehicleId,
      description,
      cost,
      status: 'In Progress'
    });
    await log.save();

    vehicle.status = 'In Shop';
    await vehicle.save();

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve maintenance log & restore vehicle status
router.post('/:id/resolve', async (req, res) => {
  try {
    const log = await Maintenance.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Maintenance log not found' });
    if (log.status === 'Completed') return res.status(400).json({ message: 'Log already resolved' });

    log.status = 'Completed';
    log.endDate = new Date();
    await log.save();

    await Vehicle.findByIdAndUpdate(log.vehicle, { status: 'Available' });

    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
