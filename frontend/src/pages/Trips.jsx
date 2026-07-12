import { useState, useEffect } from 'react';
import { fetchTrips, completeTrip } from '../services/api';
import { Navigation, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const [fuelCost, setFuelCost] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const { data } = await fetchTrips();
      setTrips(data);
    } catch (err) {
      toast.error('Failed to load trips');
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    try {
      await completeTrip(activeTrip, { fuelCost });
      toast.success('Trip completed successfully!');
      setShowFuelModal(false);
      setFuelCost('');
      setActiveTrip(null);
      loadTrips();
    } catch (err) {
      toast.error('Failed to complete trip');
    }
  };

  const filteredTrips = trips.filter(t => {
    const matchesSearch = t.origin.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.driver?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Active & Completed Trips</h1>
      </div>

      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search by Origin, Destination, or Driver..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white', minWidth: '150px' }}
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Cargo</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map(t => (
              <tr key={t._id}>
                <td style={{ fontWeight: '500' }}>{t.vehicle?.registrationNumber || 'N/A'}</td>
                <td>{t.driver?.name || 'N/A'}</td>
                <td>{t.origin} → {t.destination}</td>
                <td>{t.cargoWeight} kg</td>
                <td>${t.revenue}</td>
                <td><span className={`status-badge status-${t.status.toLowerCase().replace(' ', '')}`}>{t.status}</span></td>
                <td>
                  {t.status === 'In Progress' && (
                    <button 
                      onClick={() => { setActiveTrip(t._id); setShowFuelModal(true); }}
                      style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <CheckCircle size={14} /> Finish
                    </button>
                  )}
                  {t.status === 'Completed' && (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Fuel: ${t.fuelCost || 0}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTrips.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No trips found.</p>}
      </div>

      {showFuelModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '400px', padding: '30px' }}>
            <h3 style={{ marginBottom: '20px' }}>Complete Trip</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>Enter the total fuel cost and tolls for this trip to calculate ROI.</p>
            <form onSubmit={handleComplete} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="number" 
                placeholder="Fuel Cost ($)"
                value={fuelCost}
                onChange={(e) => setFuelCost(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                required
              />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowFuelModal(false)} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" className="btn-primary">Complete Trip</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
