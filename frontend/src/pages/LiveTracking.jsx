import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchTrips, fetchVehicles } from '../services/api';
import { Truck } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom truck icon
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/711/711246.png', // Basic truck icon
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const LiveTracking = () => {
  const [activeTrips, setActiveTrips] = useState([]);
  
  // We'll simulate coordinates for trips since we don't have real GPS data
  // In a real app, this would come from the database / websocket
  const CITIES = {
    'New York': [40.7128, -74.0060],
    'Los Angeles': [34.0522, -118.2437],
    'Chicago': [41.8781, -87.6298],
    'Houston': [29.7604, -95.3698],
    'Phoenix': [33.4484, -112.0740],
    'Philadelphia': [39.9526, -75.1652],
    'San Antonio': [29.4241, -98.4936],
    'San Diego': [32.7157, -117.1611],
    'Dallas': [32.7767, -96.7970],
    'San Jose': [37.3382, -121.8863],
    'Austin': [30.2672, -97.7431],
    'Jacksonville': [30.3322, -81.6557],
    'San Francisco': [37.7749, -122.4194],
    'Seattle': [47.6062, -122.3321],
    'Denver': [39.7392, -104.9903],
    'Boston': [42.3601, -71.0589]
  };

  useEffect(() => {
    loadData();
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      loadData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getSimulatedPosition = (originStr, destStr) => {
    // Basic fuzzy match for cities to get some coordinates
    const getCoords = (str) => {
      for (const [city, coords] of Object.entries(CITIES)) {
        if (str.toLowerCase().includes(city.toLowerCase())) return coords;
      }
      // Random US coordinates if not found
      return [37.0902 + (Math.random() * 10 - 5), -95.7129 + (Math.random() * 20 - 10)];
    };
    
    const start = getCoords(originStr);
    const end = getCoords(destStr);
    
    // Calculate a point somewhere between start and end (simulating progress)
    const progress = Math.random() * 0.8 + 0.1; // 10% to 90%
    return [
      start[0] + (end[0] - start[0]) * progress,
      start[1] + (end[1] - start[1]) * progress
    ];
  };

  const loadData = async () => {
    try {
      const { data } = await fetchTrips();
      const inProgress = data.filter(t => t.status === 'In Progress');
      
      const mappedTrips = inProgress.map(trip => {
        // Add simulated coordinates if they don't exist
        const position = getSimulatedPosition(trip.origin, trip.destination);
        return {
          ...trip,
          lat: position[0],
          lng: position[1],
          progress: Math.floor(Math.random() * 80) + 10 // Random 10-90%
        };
      });
      
      setActiveTrips(mappedTrips);
    } catch (err) {
      console.error("Failed to load tracking data", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h1 className="page-title">Live Fleet Tracking</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', flex: 1, minHeight: '600px' }}>
        {/* Map Container */}
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MapContainer 
            center={[39.8283, -98.5795]} // Center of US
            zoom={4} 
            style={{ flex: 1, width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark theme map
            />
            {activeTrips.map((trip) => (
              <Marker 
                key={trip._id} 
                position={[trip.lat, trip.lng]}
                icon={truckIcon}
              >
                <Popup className="custom-popup">
                  <div style={{ padding: '4px', minWidth: '150px' }}>
                    <strong style={{ display: 'block', marginBottom: '8px', borderBottom: '1px solid #eee', paddingBottom: '4px', color: '#333' }}>
                      {trip.vehicle?.registrationNumber || 'Unknown Vehicle'}
                    </strong>
                    <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                      <strong>Driver:</strong> {trip.driver?.name || 'N/A'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                      <strong>Route:</strong> {trip.origin} → {trip.destination}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555' }}>
                      <strong>Progress:</strong> {trip.progress}%
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Status Sidebar */}
        <div className="glass-panel" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={20} /> Active Fleet
          </h2>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '8px' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{activeTrips.length}</span>
            <span style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>Vehicles On Trip</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTrips.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>No active trips to track.</p>
            ) : (
              activeTrips.map(trip => (
                <div key={trip._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px' }}>{trip.vehicle?.registrationNumber}</span>
                    <span style={{ fontSize: '12px', color: 'var(--success)' }}>{trip.progress}% Complete</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {trip.origin} → {trip.destination}
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${trip.progress}%`, background: 'var(--accent-primary)', transition: 'width 0.5s ease' }}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
