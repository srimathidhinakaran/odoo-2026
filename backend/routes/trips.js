const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Get all trips (populated with vehicle and driver info)
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find().populate('vehicle').populate('driver');
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dispatch a trip
router.post('/dispatch', async (req, res) => {
  const { vehicleId, driverId, origin, destination, cargoWeight, revenue } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    const driver = await Driver.findById(driverId);

    if (!vehicle || !driver) {
      return res.status(404).json({ message: 'Vehicle or Driver not found.' });
    }

    // Business Logic Validations
    if (vehicle.status !== 'Available') return res.status(400).json({ message: 'Vehicle is not available.' });
    if (driver.status !== 'Available') return res.status(400).json({ message: 'Driver is not available.' });
    if (driver.licenseStatus !== 'Valid') return res.status(400).json({ message: 'Driver license is not valid.' });
    if (cargoWeight > vehicle.capacityWeight) return res.status(400).json({ message: 'Cargo weight exceeds vehicle capacity.' });

    // Create the trip
    const trip = new Trip({
      vehicle: vehicleId,
      driver: driverId,
      origin,
      destination,
      cargoWeight,
      revenue,
      status: 'In Progress',
      dispatchTime: new Date()
    });
    
    await trip.save();

    // Update statuses
    vehicle.status = 'On Trip';
    await vehicle.save();

    driver.status = 'On Trip';
    await driver.save();

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete a trip
router.post('/:id/complete', async (req, res) => {
  const { fuelCost } = req.body;
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found.' });
    if (trip.status !== 'In Progress') return res.status(400).json({ message: 'Trip is not in progress.' });

    trip.status = 'Completed';
    trip.completionTime = new Date();
    if (fuelCost) trip.fuelCost = fuelCost;
    await trip.save();

    // Release vehicle and driver
    await Vehicle.findByIdAndUpdate(trip.vehicle, { status: 'Available' });
    await Driver.findByIdAndUpdate(trip.driver, { status: 'Available' });

    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
