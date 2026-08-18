import React from 'react';
import './Card.css';

const Card = ({ children, className = '', padding = 'md', hoverable = false, onClick }) => {
  return (
    <div
      className={`card card--padding-${padding} ${hoverable ? 'card--hoverable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card__header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card__body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card__footer ${className}`}>{children}</div>
);

export default Card;