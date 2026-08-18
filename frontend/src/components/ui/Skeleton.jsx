import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width = '100%', height = '20px', borderRadius = 'md', className = '' }) => {
  return (
    <div 
      className={`skeleton skeleton--radius-${borderRadius} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`skeleton-text ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height="14px" 
          width={i === lines - 1 ? '60%' : '100%'} 
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`skeleton-card ${className}`}>
      <Skeleton height="20px" width="60%" />
      <Skeleton height="40px" width="100%" />
      <Skeleton height="14px" width="80%" />
    </div>
  );
};

export default Skeleton;