import React from 'react';
import { Calendar } from 'lucide-react';
import './DatePicker.css';

const DatePicker = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`datepicker-group ${className}`}>
      {label && <label className="datepicker__label">{label}</label>}
      <div className="datepicker__wrapper">
        <Calendar className="datepicker__icon" size={18} />
        <input 
          ref={ref}
          type="date"
          className={`datepicker__field ${error ? 'datepicker__field--error' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="datepicker__error">{error}</span>}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;