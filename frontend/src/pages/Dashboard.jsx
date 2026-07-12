import { useState, useEffect } from 'react';
import { Truck, Activity, DollarSign, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats] = useState({
    activeVehicles: 12,
    totalRevenue: 45200,
    tripsInProgress: 4,
    maintenanceAlerts: 2
  });

  const recentTrips = [
    { id: 'TRP-101', vehicle: 'Ford Transit (NYC-123)', status: 'In Progress', revenue: 850 },
    { id: 'TRP-102', vehicle: 'Volvo Truck (TEX-456)', status: 'Completed', revenue: 2400 },
    { id: 'TRP-103', vehicle: 'Sprinter Van (CAL-789)', status: 'Pending', revenue: 450 }
  ];

  // Mock data for the ROI/Revenue chart
  const chartData = [
    { name: 'Jan', revenue: 12000, expenses: 8000 },
    { name: 'Feb', revenue: 19000, expenses: 9500 },
    { name: 'Mar', revenue: 15000, expenses: 7000 },
    { name: 'Apr', revenue: 22000, expenses: 10000 },
    { name: 'May', revenue: 28000, expenses: 12000 },
    { name: 'Jun', revenue: 35000, expenses: 14000 }
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Operations Overview</h1>
        <Link to="/dispatch" className="btn-primary">
          Dispatch New Trip
        </Link>
      </div>

      <div className="kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Truck size={16} /> Active Vehicles</div>
          <div className="kpi-value">{stats.activeVehicles}</div>
        </div>
        
        <div className="glass-panel kpi-card">
          <div className="kpi-title"><Activity size={16} /> Trips In Progress</div>
          <div className="kpi-value text-accent-primary">{stats.tripsInProgress}</div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title"><DollarSign size={16} /> Total Revenue (MTD)</div>
          <div className="kpi-value text-success">${stats.totalRevenue.toLocaleString()}</div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title text-warning"><AlertCircle size={16} /> In Shop (Maintenance)</div>
          <div className="kpi-value">{stats.maintenanceAlerts}</div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
          <span>Fleet Financials & ROI Trend</span>
          <span style={{ fontSize: '12px', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
            Formula: (Revenue - Expenses) / Acq. Cost
          </span>
        </h2>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(19, 20, 28, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ fontSize: '14px' }}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" name="Expenses (Fuel + Maint)" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Recent Dispatch Activity</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Vehicle Assignment</th>
              <th>Status</th>
              <th>Est. Revenue</th>
            </tr>
          </thead>
          <tbody>
            {recentTrips.map((trip, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: '500' }}>{trip.id}</td>
                <td>{trip.vehicle}</td>
                <td>
                  <span className={`status-badge status-${trip.status.toLowerCase().replace(' ', '')}`}>
                    {trip.status}
                  </span>
                </td>
                <td>${trip.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
