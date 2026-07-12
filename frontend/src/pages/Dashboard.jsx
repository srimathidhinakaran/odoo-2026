import { useState, useEffect } from 'react';
import { Truck, Activity, DollarSign, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchVehicles, fetchTrips, fetchDrivers, fetchMaintenance } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeVehicles: 0,
    totalRevenue: 0,
    tripsInProgress: 0,
    maintenanceAlerts: 0
  });

  const [recentTrips, setRecentTrips] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [driverAlerts, setDriverAlerts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [vRes, tRes, dRes, mRes] = await Promise.all([
        fetchVehicles(),
        fetchTrips(),
        fetchDrivers(),
        fetchMaintenance()
      ]);

      const vehicles = vRes.data;
      const trips = tRes.data;
      const drivers = dRes.data;
      const maintenance = mRes.data;

      // Compute KPIs
      const activeV = vehicles.filter(v => v.status === 'Available' || v.status === 'On Trip').length;
      const inProgressTrips = trips.filter(t => t.status === 'In Progress').length;
      const inShopV = vehicles.filter(v => v.status === 'In Shop').length;
      
      const totalRev = trips.reduce((acc, trip) => acc + (trip.revenue || 0), 0);

      setStats({
        activeVehicles: activeV,
        totalRevenue: totalRev,
        tripsInProgress: inProgressTrips,
        maintenanceAlerts: inShopV
      });

      // Recent Trips (last 5)
      setRecentTrips(trips.slice(-5).reverse());

      // Driver Alerts (Suspended/Expired)
      const alerts = drivers.filter(d => d.licenseStatus !== 'Valid');
      setDriverAlerts(alerts);

      // Compute ROI / Expense chart dynamically by Month (mocking historical, adding current real data)
      const currentMonthExpenses = maintenance.reduce((acc, m) => acc + (m.cost || 0), 0) 
                                 + trips.reduce((acc, t) => acc + (t.fuelCost || 0), 0);
      
      setChartData([
        { name: 'Jan', revenue: 12000, expenses: 8000 },
        { name: 'Feb', revenue: 19000, expenses: 9500 },
        { name: 'Mar', revenue: 15000, expenses: 7000 },
        { name: 'Apr', revenue: 22000, expenses: 10000 },
        { name: 'May', revenue: 28000, expenses: 12000 },
        { name: 'Current', revenue: totalRev, expenses: currentMonthExpenses }
      ]);
    } catch (err) {
      console.error("Failed to load dashboard data");
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Trip ID,Vehicle,Driver,Revenue,Status\n"
      + recentTrips.map(t => `${t._id},${t.vehicle?.registrationNumber || 'N/A'},${t.driver?.name || 'N/A'},${t.revenue},${t.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transitops_trips_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Operations Overview</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportCSV} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)' }}>
            <Download size={18} /> Export CSV
          </button>
          <Link to="/dispatch" className="btn-primary">
            Dispatch New Trip
          </Link>
        </div>
      </div>

      {driverAlerts.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '20px', borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', marginBottom: '8px' }}>
            <AlertCircle size={18} /> Safety Compliance Alert
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            You have {driverAlerts.length} driver(s) with Suspended or Expired licenses. They have been automatically removed from the dispatch pool.
          </p>
        </div>
      )}

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
              <th>Trip Route</th>
              <th>Vehicle Assignment</th>
              <th>Status</th>
              <th>Est. Revenue</th>
            </tr>
          </thead>
          <tbody>
            {recentTrips.map((trip) => (
              <tr key={trip._id}>
                <td style={{ fontWeight: '500' }}>{trip.origin} → {trip.destination}</td>
                <td>{trip.vehicle?.registrationNumber || 'N/A'}</td>
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
        {recentTrips.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No trips dispatched yet.</p>}
      </div>
    </div>
  );
};

export default Dashboard;
