import { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle } from 'lucide-react';
import { fetchMaintenance, createMaintenance, resolveMaintenance, fetchVehicles } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Maintenance = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', description: '', cost: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([fetchMaintenance(), fetchVehicles()]);
      setLogs(mRes.data);
      setVehicles(vRes.data.filter(v => v.status === 'Available'));
    } catch (err) {
      toast.error('Failed to load maintenance data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenance(formData);
      toast.success('Maintenance logged & vehicle marked as In Shop!');
      setShowForm(false);
      setFormData({ vehicleId: '', description: '', cost: '' });
      loadData();
    } catch (err) {
      toast.error('Failed to log maintenance');
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveMaintenance(id);
      toast.success('Maintenance resolved & vehicle is available again!');
      loadData();
    } catch (err) {
      toast.error('Failed to resolve maintenance');
    }
  };

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Fleet Maintenance Center</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Log Repair
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Schedule Maintenance</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <select 
              value={formData.vehicleId} 
              onChange={e => setFormData({...formData, vehicleId: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required
            >
              <option value="">Select Available Vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.make} {v.model}</option>
              ))}
            </select>
            
            <input 
              type="text" 
              placeholder="Repair Description (e.g., Oil Change, Brake Replacement)" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required 
            />
            
            <input 
              type="number" 
              placeholder="Estimated Cost ($)" 
              value={formData.cost} 
              onChange={e => setFormData({...formData, cost: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required 
            />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary"><Wrench size={18} /> Submit to Shop</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td style={{ fontWeight: '500' }}>{log.vehicle?.registrationNumber || 'N/A'}</td>
                <td>{log.description}</td>
                <td>${log.cost}</td>
                <td>
                  <span className={`status-badge status-${log.status.toLowerCase().replace(' ', '')}`}>
                    {log.status}
                  </span>
                </td>
                <td>
                  {log.status === 'In Progress' && (
                    <button 
                      onClick={() => handleResolve(log._id)}
                      style={{ background: 'var(--success)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <CheckCircle size={14} /> Resolve
                    </button>
                  )}
                  {log.status === 'Resolved' && (
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Completed on {new Date(log.resolutionDate).toLocaleDateString()}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No maintenance logs found.</p>}
      </div>
    </div>
  );
};

export default Maintenance;
