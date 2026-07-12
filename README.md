# TransitOps 🚛

TransitOps is a modern, hackathon-ready **MERN Stack** (MongoDB, Express, React, Node.js) platform designed for advanced fleet and logistics management. It acts as a central command center for dispatchers, fleet managers, and financial analysts to oversee and optimize transportation networks in real-time.

---

## 🏗️ Core Architecture & Tech Stack

- **Frontend**: Built with React and Vite. It utilizes `recharts` for dynamic analytics, `react-leaflet` for live GPS tracking, and a custom CSS glassmorphism design system for a premium aesthetic.
- **Backend**: An Express.js REST API interacting with MongoDB models (`Trip`, `Vehicle`, `Driver`, `Expense`, `Document`, `Maintenance`).

---

## 📦 Module Breakdown

### 1. 📊 Operations Dashboard (The Command Center)
- **What it does**: Provides a bird's-eye view of your logistics network.
- **How it works**: It pulls data from all backend endpoints simultaneously to calculate KPIs (Active Vehicles, Total Revenue, Trips in Progress). 
- **Key Features**:
  - **Financial Area Chart**: Plots revenue vs. operational expenses (fuel + maintenance) to show your ROI trend.
  - **Advanced Analytics**: Interactive Pie Charts for *Vehicle Utilization* (Available vs. In Shop vs. On Trip) and *Maintenance Cost Analysis* (engine vs. tyres, etc.).
  - **Smart Alerts**: Automatically scans the database and displays warnings if a vehicle needs maintenance or if a driver's license has expired.
  - **Exporting**: One-click generation of CSV and PDF reports for stakeholders.

### 2. 🗺️ Live Fleet Tracking (GPS Module)
- **What it does**: Tracks vehicles that are currently dispatched.
- **How it works**: It uses `react-leaflet` to render a dark-themed map of the USA. It filters the database for all trips marked as `In Progress` and simulates their GPS coordinates based on their Origin and Destination. A sidebar shows the completion percentage of each trip via an animated progress bar.

### 3. 🚀 Dispatch & AI Route Optimization
- **What it does**: Used to assign a driver and a vehicle to a new delivery route.
- **How it works**: It strictly pulls vehicles and drivers that have an `Available` status. 
- **Smart Suggestion Feature**: By inputting the Origin, Destination, and Cargo weight, you can click **"Get Smart Suggestion"**. The AI simulates an optimization algorithm to recommend the best route, calculate the exact distance, predict fuel consumption, and output a recommended cost/revenue for the trip. 

### 4. 🛣️ Trip Management & Timeline
- **What it does**: Monitors the lifecycle of a dispatched delivery.
- **How it works**: Once dispatched, the trip enters the `Trips` table. You can click the **Timeline** button to see a visual step-by-step modal (Trip Created ➔ Resources Assigned ➔ In Transit ➔ Completed). When a trip is marked as "Finished", the manager inputs the final fuel cost, which is then fed into the global Expense and ROI charts.

### 5. 🚚 Vehicles & 👤 Drivers (Master Registries)
- **What they do**: Act as the source of truth for your physical assets and human resources.
- **Vehicle Document Management**: You can click "Docs" on any vehicle/driver to open a secure modal. This allows uploading base64 files (PDFs/Images) for things like RC Books, Pollution Certificates, and Driving Licenses.
- **Driver Performance Scorecard**: Managers can click the **"Score"** button next to a driver to see a detailed telematics breakdown (Safety Score percentage, fuel efficiency, late deliveries, and accident history).

### 6. 💰 Financials (Expenses, Fuel, Maintenance)
- **What it does**: Tracks every dollar spent operating the fleet.
- **How it works**: The Expenses module includes granular logistics costs like *Tolls, Parking, Driver Allowance, and Permits*. The Maintenance module logs specific repair costs (Engine, Tyres, etc.), which directly updates the "In Shop" vehicle status and populates the Dashboard's Maintenance Pie Chart.

---

## 🔄 How Everything Connects (The Workflow)

The beauty of this project is how deeply integrated the modules are:

1. **Asset Registration**: You register a Driver and a Vehicle. They appear as `Available`.
2. **AI Dispatch**: You go to Dispatch and create a route using the AI Suggestion. You assign the Driver and Vehicle.
3. **State Management**: The Driver and Vehicle statuses immediately switch to `On Trip`. They are now removed from the dispatch pool so they can't be double-booked.
4. **Real-time Analytics**: The Dashboard Charts update instantly: Utilization shows more vehicles "On Trip", and the Expected Revenue chart spikes.
5. **GPS Tracking**: The vehicle appears as a moving truck on the Live Tracking Map.
6. **Completion**: When the delivery is done, the manager marks it `Completed` in the Trips module and inputs the fuel cost.
7. **Financial Sync**: The Driver and Vehicle return to `Available`, and the fuel cost is automatically pushed to the Expenses logs, updating your true ROI globally.

---
*Built for the 2026 Hackathon Evaluation.*
