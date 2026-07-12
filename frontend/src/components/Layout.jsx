import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Send } from 'lucide-react';

const Layout = ({ onLogout }) => {
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
            <Truck size={20} />
            Trips
          </NavLink>
          <NavLink to="/maintenance" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Truck size={20} />
            Maintenance
          </NavLink>
          <NavLink to="/fuel" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Truck size={20} />
            Fuel Logs
          </NavLink>
          <NavLink to="/expenses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Truck size={20} />
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
        
        <div style={{ marginTop: 'auto' }}>
          <button onClick={onLogout} className="nav-link" style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left', color: 'var(--danger)' }}>
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
