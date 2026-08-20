import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Search, Clock, User, Plus, Edit } from 'lucide-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AppointmentFormModal from '../../components/modals/AppointmentFormModal';
import { formatDateTime } from '../../utils/formatDate';
import './Appointments.css';

const getStatusVariant = (status) => {
  const map = {
    scheduled: 'info',
    confirmed: 'primary',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger',
    no_show: 'default',
  };
  return map[status] || 'default';
};

const Appointments = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', { search, page, status: statusFilter }],
    queryFn: () => appointmentService.getAll({ search, page, limit: 10, status: statusFilter }),
  });

  const columns = [
    {
      key: 'patient',
      header: 'Patient',
      render: (row) => (
        <div className="appointment-patient">
          <User size={16} className="appointment-icon" />
          <span>{row.patient?.firstName} {row.patient?.lastName}</span>
        </div>
      ),
    },
    {
      key: 'dentist',
      header: 'Dentist',
      render: (row) => (
        <div className="appointment-dentist">
          <span>Dr. {row.dentist?.user?.firstName} {row.dentist?.user?.lastName}</span>
        </div>
      ),
    },
    {
      key: 'datetime',
      header: 'Date & Time',
      render: (row) => (
        <div className="appointment-datetime">
          <Calendar size={14} className="appointment-icon" />
          <span>{formatDateTime(row.startDateTime)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedAppointment(row);
            setIsModalOpen(true);
          }}
        >
          <Edit size={14} /> Edit
        </Button>
      ),
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage daily schedules and patient visits.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Calendar size={18} /> New Appointment
        </Button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search patient or dentist..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {error && <div className="error-message">Failed to load appointments. Please try again.</div>}

      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No appointments found matching your criteria."
      />

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="pagination-info">
            Page {page} of {data.meta.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === data.meta.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AppointmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default Appointments;