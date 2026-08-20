import React from 'react';
import Card from './Card';
import './ChartCard.css';

const ChartCard = ({ title, children, className = '' }) => {
  return (
    <Card padding="lg" className={`chart-card ${className}`}>
      <h3 className="chart-card__title">{title}</h3>
      <div className="chart-card__content">
        {children}
      </div>
    </Card>
  );
};

export default ChartCard;