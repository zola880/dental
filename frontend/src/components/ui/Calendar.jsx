import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Calendar.css';

const Calendar = ({
  calendarDays,
  weekDays,
  monthName,
  year,
  view,
  onNavigate,
  onDateClick,
  onTodayClick,
  isToday,
  renderDayContent,
}) => {
  const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleNavigate = (direction) => {
    if (view === 'month') {
      onNavigate(direction);
    } else if (view === 'week') {
      onNavigate(direction);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button 
          className="calendar__nav-btn"
          onClick={() => handleNavigate(-1)}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="calendar__title">
          {monthName} {year}
        </h3>
        <button 
          className="calendar__nav-btn"
          onClick={() => handleNavigate(1)}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
        <button 
          className="calendar__today-btn"
          onClick={onTodayClick}
        >
          Today
        </button>
      </div>

      {view === 'month' && (
        <div className="calendar__grid">
          <div className="calendar__weekdays">
            {weekDayNames.map((day) => (
              <div key={day} className="calendar__weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar__days">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`calendar__day ${
                  !day.isCurrentMonth ? 'calendar__day--other-month' : ''
                } ${isToday(day.date) ? 'calendar__day--today' : ''}`}
                onClick={() => onDateClick && onDateClick(day.date)}
              >
                <span className="calendar__day-number">{day.date.getDate()}</span>
                {renderDayContent && (
                  <div className="calendar__day-content">
                    {renderDayContent(day.date)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'week' && (
        <div className="calendar__week-view">
          <div className="calendar__week-header">
            {weekDayNames.map((day, idx) => (
              <div 
                key={day} 
                className={`calendar__week-day-header ${weekDays[idx]?.isToday ? 'calendar__week-day-header--today' : ''}`}
              >
                <span className="calendar__week-day-name">{day}</span>
                <span className="calendar__week-day-number">
                  {weekDays[idx]?.date.getDate()}
                </span>
              </div>
            ))}
          </div>
          <div className="calendar__week-body">
            {weekDays.map((day, idx) => (
              <div 
                key={idx} 
                className={`calendar__week-column ${day.isToday ? 'calendar__week-column--today' : ''}`}
                onClick={() => onDateClick && onDateClick(day.date)}
              >
                {renderDayContent && renderDayContent(day.date)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;