import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { dentistService } from '../../services/dentistService';
import { useCalendar } from '../../hooks/useCalendar';
import { Calendar as CalendarIcon, List, Filter } from 'lucide-react';
import Calendar from '../../components/ui/Calendar';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import './AppointmentCalendar.css';

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const calendar = useCalendar();
  const [dentistFilter, setDentistFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['calendar-appointments', calendar.currentDate, dentistFilter],
    queryFn: () => {
      const startDate = new Date(calendar.currentDate);
      startDate.setDate(1);
      const endDate = new Date(calendar.currentDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);

      return appointmentService.getCalendar({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dentistId: dentistFilter || undefined,
      });
    },
  });

  const { data: dentistsData } = useQuery({
    queryKey: ['dentists-list'],
    queryFn: () => dentistService.getAll({ limit: 100 }),
  });

  const appointments = appointmentsData?.data?.appointments || [];
  const dentists = dentistsData?.data || [];

  const dentistOptions = [
    { value: '', label: 'All Dentists' },
    ...dentists.map(d => ({
      value: d._id,
      label: `Dr. ${d.user?.firstName} ${d.user?.lastName}`,
    })),
  ];

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.startDateTime);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'var(--color-info)',
      confirmed: 'var(--color-primary)',
      in_progress: 'var(--color-warning)',
      completed: 'var(--color-success)',
      cancelled: 'var(--color-error)',
      no_show: 'var(--color-text-muted)',
    };
    return colors[status] || 'var(--color-text-muted)';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const renderDayContent = (date) => {
    const dayAppointments = getAppointmentsForDate(date);
    
    if (dayAppointments.length === 0) return null;

    return (
      <div className="calendar-appointments">
        {dayAppointments.slice(0, 3).map((apt) => (
          <div
            key={apt._id}
            className="calendar-appointment"
            style={{ borderLeftColor: getStatusColor(apt.status) }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/appointments`);
            }}
          >
            <span className="calendar-appointment__time">
              {new Date(apt.startDateTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
            <span className="calendar-appointment__patient">
              {apt.patient?.firstName} {apt.patient?.lastName}
            </span>
          </div>
        ))}
        {dayAppointments.length > 3 && (
          <span className="calendar-appointment__more">
            +{dayAppointments.length - 3} more
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Calendar</h1>
          <p className="page-subtitle">Visual schedule of all appointments.</p>
        </div>
        <div className="calendar-page__actions">
          <Select
            options={dentistOptions}
            value={dentistFilter}
            onChange={(e) => setDentistFilter(e.target.value)}
            placeholder="Filter by dentist"
          />
          <div className="view-toggle">
            <button
              className={`view-toggle__btn ${calendar.view === 'month' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => calendar.setView('month')}
            >
              <CalendarIcon size={16} />
              Month
            </button>
            <button
              className={`view-toggle__btn ${calendar.view === 'week' ? 'view-toggle__btn--active' : ''}`}
              onClick={() => calendar.setView('week')}
            >
              <List size={16} />
              Week
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="calendar-loading">Loading appointments...</div>
      ) : (
        <Calendar
          calendarDays={calendar.calendarDays}
          weekDays={calendar.weekDays}
          monthName={calendar.monthName}
          year={calendar.year}
          view={calendar.view}
          onNavigate={(dir) => calendar.view === 'month' ? calendar.navigateMonth(dir) : calendar.navigateWeek(dir)}
          onDateClick={handleDateClick}
          onTodayClick={calendar.goToToday}
          isToday={calendar.isToday}
          renderDayContent={renderDayContent}
        />
      )}

      {selectedDate && (
        <div className="selected-date-info">
          <h3>
            Appointments for {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          <div className="selected-date-appointments">
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <p className="no-appointments">No appointments scheduled for this date.</p>
            ) : (
              getAppointmentsForDate(selectedDate).map((apt) => (
                <div key={apt._id} className="appointment-detail-card">
                  <div className="appointment-detail-card__time">
                    {new Date(apt.startDateTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="appointment-detail-card__info">
                    <span className="appointment-detail-card__patient">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </span>
                    <span className="appointment-detail-card__dentist">
                      Dr. {apt.dentist?.user?.firstName} {apt.dentist?.user?.lastName}
                    </span>
                  </div>
                  <Badge variant={
                    apt.status === 'completed' ? 'success' :
                    apt.status === 'cancelled' ? 'danger' :
                    apt.status === 'in_progress' ? 'warning' : 'info'
                  }>
                    {apt.status.replace('_', ' ')}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;