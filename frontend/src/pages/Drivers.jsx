import { useState, useEffect } from 'react';
import { Users, Plus, Edit } from 'lucide-react';
import { fetchDrivers } from '../services/api';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    licenseStatus: 'Valid'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const { data } = await fetchDrivers();
      setDrivers(data);
    } catch (err) {
      toast.error('Failed to load drivers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/drivers`, formData);
      toast.success('Driver added successfully!');
      setShowForm(false);
      loadDrivers();
      setFormData({ name: '', phone: '', licenseNumber: '', licenseStatus: 'Valid' });
    } catch (err) {
      toast.error('Failed to add driver');
    }
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Driver Management Module</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Add New Driver
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Register New Driver</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="text" placeholder="License Number" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            
            <select value={formData.licenseStatus} onChange={e => setFormData({...formData, licenseStatus: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required>
              <option value="Valid">Valid</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
            </select>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary"><Users size={18} /> Register Driver</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Search by Name or License..." 
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>License Number</th>
              <th>Phone</th>
              <th>License Status</th>
              <th>Current Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map(d => (
              <tr key={d._id}>
                <td style={{ fontWeight: '500' }}>{d.name}</td>
                <td>{d.licenseNumber}</td>
                <td>{d.phone}</td>
                <td>
                  <span style={{ color: d.licenseStatus === 'Valid' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                    {d.licenseStatus}
                  </span>
                </td>
                <td><span className={`status-badge status-${d.status.toLowerCase().replace(' ', '')}`}>{d.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Edit size={16} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDrivers.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No drivers found.</p>}
      </div>
    </div>
  );
};

export default Drivers;
