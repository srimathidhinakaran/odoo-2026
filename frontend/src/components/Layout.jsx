import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Send, Map, Wrench, Fuel, DollarSign } from 'lucide-react';

const Layout = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Truck size={28} />
          TransitOps
        </div>
        
        <nav>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/dispatch" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Send size={20} />
            Dispatch Trip
          </NavLink>
          <NavLink to="/trips" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Map size={20} />
            Trips
          </NavLink>
          <NavLink to="/maintenance" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Wrench size={20} />
            Maintenance
          </NavLink>
          <NavLink to="/fuel" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Fuel size={20} />
            Fuel Logs
          </NavLink>
          <NavLink to="/expenses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <DollarSign size={20} />
            Expenses
          </NavLink>
          <NavLink to="/vehicles" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Truck size={20} />
            Vehicles
          </NavLink>
          <NavLink to="/drivers" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Users size={20} />
            Drivers
          </NavLink>
        </nav>
        
        <div className="sidebar-logout">
          {user && (
            <div style={{ padding: '12px 16px', marginBottom: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <div style={{ fontWeight: '600', fontSize: '14px', color: 'white' }}>{user.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent-primary)', marginTop: '2px' }}>{user.role}</div>
            </div>
          )}
          <button onClick={onLogout} className="nav-link logout-btn">
            Log Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
