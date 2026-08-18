import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`spinner spinner--${size} ${className}`} role="status">
      <div className="spinner__circle"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;