import React from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

const Select = React.forwardRef(({ 
  label, 
  error, 
  options = [], 
  placeholder = 'Select an option',
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`select-group ${className}`}>
      {label && <label className="select__label">{label}</label>}
      <div className="select__wrapper">
        <select 
          ref={ref}
          className={`select__field ${error ? 'select__field--error' : ''}`}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select__icon" size={18} />
      </div>
      {error && <span className="select__error">{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;