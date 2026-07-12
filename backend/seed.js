const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('./models/Vehicle');
const Driver = require('./models/Driver');
const Trip = require('./models/Trip');
const Maintenance = require('./models/Maintenance');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Maintenance.deleteMany();
    console.log('Cleared existing data.');

    // Seed Vehicles
    const v1 = await Vehicle.create({ registrationNumber: 'NY-1001', make: 'Volvo', model: 'FH16', type: 'Truck', capacityWeight: 20000, acquisitionCost: 150000, status: 'Available' });
    const v2 = await Vehicle.create({ registrationNumber: 'TX-2022', make: 'Ford', model: 'Transit', type: 'Van', capacityWeight: 3000, acquisitionCost: 45000, status: 'Available' });
    const v3 = await Vehicle.create({ registrationNumber: 'CA-3303', make: 'Mercedes', model: 'Sprinter', type: 'Van', capacityWeight: 3500, acquisitionCost: 55000, status: 'Available' });
    const v4 = await Vehicle.create({ registrationNumber: 'FL-4004', make: 'Kenworth', model: 'T680', type: 'Truck', capacityWeight: 22000, acquisitionCost: 165000, status: 'Available' });
    
    // Seed Drivers
    const d1 = await Driver.create({ name: 'John Smith', phone: '555-0101', licenseNumber: 'DL-NY-12345', licenseStatus: 'Valid', status: 'Available' });
    const d2 = await Driver.create({ name: 'Sarah Connor', phone: '555-0202', licenseNumber: 'DL-CA-98765', licenseStatus: 'Valid', status: 'Available' });
    const d3 = await Driver.create({ name: 'Mike Johnson', phone: '555-0303', licenseNumber: 'DL-TX-55555', licenseStatus: 'Expired', status: 'Available' });
    const d4 = await Driver.create({ name: 'Emily Davis', phone: '555-0404', licenseNumber: 'DL-FL-11111', licenseStatus: 'Suspended', status: 'Available' });

    // Create some historical/active trips
    await Trip.create({
      vehicle: v1._id,
      driver: d1._id,
      origin: 'New York, NY',
      destination: 'Boston, MA',
      cargoWeight: 15000,
      revenue: 1200,
      fuelCost: 300,
      status: 'Completed',
      dispatchTime: new Date(Date.now() - 86400000 * 2), // 2 days ago
      completionTime: new Date(Date.now() - 86400000)
    });

    // Make an active trip
    await Trip.create({
      vehicle: v2._id,
      driver: d2._id,
      origin: 'Austin, TX',
      destination: 'Dallas, TX',
      cargoWeight: 2000,
      revenue: 500,
      status: 'In Progress',
      dispatchTime: new Date()
    });
    
    // Update statuses for active trip
    v2.status = 'On Trip'; await v2.save();
    d2.status = 'On Trip'; await d2.save();

    // Create a maintenance record
    await Maintenance.create({
      vehicle: v3._id,
      description: 'Engine Diagnostics and Oil Change',
      cost: 450,
      status: 'In Progress'
    });
    
    v3.status = 'In Shop'; await v3.save();

    console.log('Seeding Complete! 🎉');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
