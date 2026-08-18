import React from 'react';
import { Outlet } from 'react-router-dom';
import './PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <Outlet />
    </div>
  );
};

export default PublicLayout;