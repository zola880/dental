import React from 'react';
import './Input.css';

const Input = React.forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input__label">{label}</label>}
      <div className="input__wrapper">
        {Icon && <Icon className="input__icon" size={18} />}
        <input 
          ref={ref}
          className={`input__field ${error ? 'input__field--error' : ''}`} 
          {...props} 
        />
      </div>
      {error && <span className="input__error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;