import React from 'react';
import './FormRow.css';

const FormRow = ({ children, columns = 2, className = '' }) => {
  return (
    <div 
      className={`form-row form-row--cols-${columns} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormRow;