import { useState, useEffect } from 'react';
import { Truck, Plus, Trash2, Edit } from 'lucide-react';
import { fetchVehicles } from '../services/api';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    make: '',
    model: '',
    type: 'Truck',
    capacityWeight: '',
    acquisitionCost: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const { data } = await fetchVehicles();
      setVehicles(data);
    } catch (err) {
      toast.error('Failed to load vehicles');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vehicles`, formData);
      toast.success('Vehicle added successfully!');
      setShowForm(false);
      loadVehicles();
      setFormData({ registrationNumber: '', make: '', model: '', type: 'Truck', capacityWeight: '', acquisitionCost: '' });
    } catch (err) {
      toast.error('Failed to add vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.make.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Master Vehicle Registry</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add New Vehicle
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Register New Vehicle</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input type="text" placeholder="Registration (e.g. NYC-123)" value={formData.registrationNumber} onChange={e => setFormData({...formData, registrationNumber: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="text" placeholder="Make (e.g. Volvo)" value={formData.make} onChange={e => setFormData({...formData, make: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="text" placeholder="Model (e.g. FH16)" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Car">Car</option>
            </select>

            <input type="number" placeholder="Max Load Capacity (kg)" value={formData.capacityWeight} onChange={e => setFormData({...formData, capacityWeight: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="number" placeholder="Acquisition Cost ($)" value={formData.acquisitionCost} onChange={e => setFormData({...formData, acquisitionCost: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary"><Truck size={18} /> Register Fleet Vehicle</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search by Make, Model, or Reg..." 
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
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Make & Model</th>
              <th>Type</th>
              <th>Max Load</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map(v => (
              <tr key={v._id}>
                <td style={{ fontWeight: '500' }}>{v.registrationNumber}</td>
                <td>{v.make} {v.model}</td>
                <td>{v.type}</td>
                <td>{v.capacityWeight} kg</td>
                <td><span className={`status-badge status-${v.status.toLowerCase().replace(' ', '')}`}>{v.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Edit size={16} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVehicles.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No vehicles found.</p>}
      </div>
    </div>
  );
};

export default Vehicles;
