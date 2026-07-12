import { useState, useEffect } from 'react';
import { fetchExpenses, addExpense, fetchVehicles } from '../services/api';
import { Plus, DollarSign } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ vehicle: '', type: 'Fuel', amount: '', description: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eRes, vRes] = await Promise.all([fetchExpenses(), fetchVehicles()]);
      setExpenses(eRes.data.reverse());
      setVehicles(vRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense(formData);
      toast.success('Expense recorded successfully!');
      setShowForm(false);
      setFormData({ vehicle: '', type: 'Fuel', amount: '', description: '' });
      loadData();
    } catch (err) {
      toast.error('Failed to record expense');
    }
  };

  return (
    <div className="animate-fade-in">
      <Toaster position="top-center" />
      <div className="page-header">
        <h1 className="page-title">Expense Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Record Expense
        </button>
      </div>

      {showForm && (
        <div className="glass-panel" style={{ marginBottom: '32px', maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Add Operational Expense</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <select 
              value={formData.vehicle} 
              onChange={e => setFormData({...formData, vehicle: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber}</option>
              ))}
            </select>
            
            <select 
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value})} 
              style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required
            >
              <option value="Fuel">Fuel</option>
              <option value="Toll">Toll</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>

            <input type="number" placeholder="Amount ($)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} required />
            <input type="text" placeholder="Description / Notes" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: 'white' }} />

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">Save Expense</button>
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
              <th>Expense Type</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td>{new Date(exp.date).toLocaleDateString()}</td>
                <td style={{ fontWeight: '500' }}>{exp.vehicle?.registrationNumber || 'N/A'}</td>
                <td>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '12px' }}>{exp.type}</span>
                </td>
                <td>{exp.description || '-'}</td>
                <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>${exp.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {expenses.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No expenses recorded.</p>}
      </div>
    </div>
  );
};

export default Expenses;
