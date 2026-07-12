import { useState, useEffect } from 'react';
import { Send, MapPin, Truck, Users, DollarSign, Weight, Sparkles } from 'lucide-react';
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
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

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

  const handleSmartSuggestion = () => {
    if (!formData.origin || !formData.destination || !formData.cargoWeight) {
      setError('Please provide Origin, Destination, and Cargo Weight to get AI suggestions.');
      return;
    }
    setError('');
    setIsAiLoading(true);
    
    // Simulate AI API call
    setTimeout(() => {
      // Mocked calculation based on simple length string difference, just for demo
      const distance = Math.floor(Math.random() * 800) + 100; // 100 to 900 km
      const recommendedRevenue = distance * 2.5 + (formData.cargoWeight * 0.1); // Dynamic calculation
      
      setAiSuggestion({
        route: `${formData.origin} → Interstate Hwy → ${formData.destination}`,
        distance: distance,
        estFuelLiters: (distance / 5).toFixed(1), // Assuming 5km/l
        estCost: (distance * 1.2).toFixed(0), // $1.2 per km cost
      });
      
      setFormData(prev => ({ ...prev, revenue: Math.floor(recommendedRevenue) }));
      setIsAiLoading(false);
    }, 1500);
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

          {/* AI Suggestion Panel */}
          <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> AI Route Optimization
              </h3>
              <button 
                type="button" 
                onClick={handleSmartSuggestion} 
                disabled={isAiLoading}
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
              >
                {isAiLoading ? 'Analyzing...' : 'Get Smart Suggestion'}
              </button>
            </div>
            
            {aiSuggestion && (
              <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Recommended Route</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{aiSuggestion.route}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Distance</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{aiSuggestion.distance} km</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Est. Fuel Usage</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>{aiSuggestion.estFuelLiters} Litres</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Est. Trip Cost</div>
                  <div style={{ fontSize: '14px', fontWeight: '500' }}>${aiSuggestion.estCost}</div>
                </div>
              </div>
            )}
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
