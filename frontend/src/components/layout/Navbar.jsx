import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__search">
        <Search size={18} className="navbar__search-icon" />
        <input 
          type="text" 
          placeholder="Search patients, appointments..." 
          className="navbar__search-input"
        />
      </div>

      <div className="navbar__actions">
        <button className="navbar__icon-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="navbar__badge">3</span>
        </button>
        
        <div className="navbar__user">
          <div className="navbar__avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} />
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="navbar__user-info">
            <span className="navbar__user-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="navbar__user-role">
              {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;