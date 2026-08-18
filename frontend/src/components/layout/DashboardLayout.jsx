import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-layout__main">
        <Navbar />
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;