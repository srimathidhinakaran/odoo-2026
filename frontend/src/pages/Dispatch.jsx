import { useState, useEffect } from 'react';
import { Send, MapPin, Truck, Users, DollarSign, Weight } from 'lucide-react';
import { fetchVehicles, fetchDrivers, dispatchTrip } from '../services/api';

const Dispatch = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    cargoWeight: '',
    revenue: '',
    vehicleId: '',
    driverId: ''
  });

  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [vRes, dRes] = await Promise.all([fetchVehicles(), fetchDrivers()]);
        // Filter out those already on a trip or in shop based on our advanced rules
        setAvailableVehicles(vRes.data.filter(v => v.status === 'Available'));
        setAvailableDrivers(dRes.data.filter(d => d.status === 'Available' && d.licenseStatus === 'Valid'));
      } catch (err) {
        console.error("Failed to load resources", err);
      }
    };
    loadResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await dispatchTrip(formData);
      setSuccess('Trip dispatched successfully! Vehicle and driver are now On Trip.');
      // Reset form
      setFormData({ origin: '', destination: '', cargoWeight: '', revenue: '', vehicleId: '', driverId: '' });
      // Remove used resources from local state
      setAvailableVehicles(prev => prev.filter(v => v._id !== formData.vehicleId));
      setAvailableDrivers(prev => prev.filter(d => d._id !== formData.driverId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to dispatch trip.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dispatch New Trip</h1>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>}
        {success && <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Origin & Destination */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> Origin</label>
              <input 
                type="text" 
                placeholder="Enter pickup location"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.origin}
                onChange={e => setFormData({...formData, origin: e.target.value})}
                required
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }}/> Destination</label>
              <input 
                type="text" 
                placeholder="Enter dropoff location"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.destination}
                onChange={e => setFormData({...formData, destination: e.target.value})}
                required
              />
            </div>

            {/* Assignments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><Truck size={14} style={{ display: 'inline', marginRight: '4px' }}/> Assign Vehicle</label>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.vehicleId}
                onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                required
              >
                <option value="">Select an available vehicle...</option>
                {availableVehicles.map(v => <option key={v._id} value={v._id}>{v.make} {v.model} ({v.registrationNumber}) - Max {v.capacityWeight}kg</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><Users size={14} style={{ display: 'inline', marginRight: '4px' }}/> Assign Driver</label>
              <select 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.driverId}
                onChange={e => setFormData({...formData, driverId: e.target.value})}
                required
              >
                <option value="">Select an available driver...</option>
                {availableDrivers.map(d => <option key={d._id} value={d._id}>{d.name} ({d.licenseNumber})</option>)}
              </select>
            </div>

            {/* Metrics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><Weight size={14} style={{ display: 'inline', marginRight: '4px' }}/> Cargo Weight (kg)</label>
              <input 
                type="number" 
                placeholder="e.g. 1500"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.cargoWeight}
                onChange={e => setFormData({...formData, cargoWeight: Number(e.target.value)})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}><DollarSign size={14} style={{ display: 'inline', marginRight: '4px' }}/> Expected Revenue ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 2400"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={formData.revenue}
                onChange={e => setFormData({...formData, revenue: Number(e.target.value)})}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary">
              <Send size={18} /> Complete Dispatch Workflow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Dispatch;
