import { useState, useEffect } from 'react';
import { fetchFuelLogs, addFuelLog, fetchVehicles } from '../services/api';
import { Plus, Info } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const FuelLogs = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicle: '', liters: '', cost: '', odometer: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lRes, vRes] = await Promise.all([fetchFuelLogs(), fetchVehicles()]);
      setLogs(lRes.data.reverse());
      setVehicles(vRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addFuelLog(formData);
      toast.success('Fuel log added successfully!');
      setShowForm(false);
      setFormData({ vehicle: '', liters: '', cost: '', odometer: '' });
      loadData();
    } catch (err) {
      toast.error('Failed to add fuel log');
    }
  };

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Fuel Tracking</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add Fuel Entry
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Log Fuel Consumption</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <select 
              value={formData.vehicle} 
              onChange={e => setFormData({...formData, vehicle: e.target.value})} 
              style={{ gridColumn: '1 / -1', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.make} {v.model}</option>
              ))}
            </select>
            
            <input type="number" placeholder="Liters Filled" value={formData.liters} onChange={e => setFormData({...formData, liters: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="number" placeholder="Total Cost ($)" value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="number" placeholder="Odometer Reading" value={formData.odometer} onChange={e => setFormData({...formData, odometer: e.target.value})} style={{ gridColumn: '1 / -1', padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">Save Log</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Odometer</th>
              <th>Liters</th>
              <th>Cost</th>
              <th>Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => {
              // Basic efficiency calculation if we have previous log
              let prevLog = logs.slice(index + 1).find(l => l.vehicle?._id === log.vehicle?._id);
              let efficiency = 'N/A';
              if (prevLog && prevLog.odometer < log.odometer) {
                efficiency = ((log.odometer - prevLog.odometer) / log.liters).toFixed(2) + ' km/L';
              }
              return (
                <tr key={log._id}>
                  <td>{new Date(log.date).toLocaleDateString()}</td>
                  <td style={{ fontWeight: '500' }}>{log.vehicle?.registrationNumber || 'N/A'}</td>
                  <td>{log.odometer}</td>
                  <td>{log.liters} L</td>
                  <td>${log.cost}</td>
                  <td><span style={{color: 'var(--accent-primary)'}}>{efficiency}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {logs.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No fuel logs found.</p>}
      </div>
    </div>
  );
};

export default FuelLogs;
