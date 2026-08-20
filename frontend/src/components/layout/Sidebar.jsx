import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  Receipt, 
  TrendingUp, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Tooth,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'dentist', 'receptionist', 'accountant'] },
    { path: '/dashboard/patients', icon: Users, label: 'Patients', roles: ['admin', 'dentist', 'receptionist'] },
    { path: '/dashboard/appointments', icon: Calendar, label: 'Appointments', roles: ['admin', 'dentist', 'receptionist'] },
    { path: '/dashboard/treatments', icon: Stethoscope, label: 'Treatments', roles: ['admin', 'dentist'] },
    { path: '/dashboard/dentists', icon: Briefcase, label: 'Dentists', roles: ['admin'] },
    { path: '/dashboard/services', icon: Briefcase, label: 'Services', roles: ['admin'] },
    { path: '/dashboard/billing', icon: Receipt, label: 'Billing', roles: ['admin', 'accountant', 'receptionist'] },
    { path: '/dashboard/financials', icon: TrendingUp, label: 'Financials', roles: ['admin', 'accountant'] },
    { path: '/dashboard/notifications', icon: Bell, label: 'Notifications', roles: ['admin', 'dentist', 'receptionist', 'accountant'] },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !user?.role || item.roles.includes(user.role)
  );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <button 
        className="sidebar__mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${isMobileOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <Tooth size={28} color="var(--color-primary)" />
            {!isCollapsed && <span className="sidebar__brand">DentalCare</span>}
          </div>
          <button 
            className="sidebar__collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                }
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar__footer">
          <button 
            className="sidebar__link sidebar__logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;