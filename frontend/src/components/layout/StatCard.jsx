import React from 'react';
import Card from '../ui/Card';
import './StatCard.css';

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  className = '' 
}) => {
  return (
    <Card className={`stat-card ${className}`} padding="lg">
      <div className="stat-card__header">
        {Icon && (
          <div className="stat-card__icon">
            <Icon size={24} />
          </div>
        )}
        {change && (
          <span className={`stat-card__change stat-card__change--${changeType}`}>
            {change}
          </span>
        )}
      </div>
      <div className="stat-card__content">
        <h3 className="stat-card__title">{title}</h3>
        <p className="stat-card__value">{value}</p>
      </div>
    </Card>
  );
};

export default StatCard;