import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';
import { serviceService } from '../../services/serviceService';
import { Search, Plus, Calendar, Clock, User, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { APPOINTMENT_STATUS_LABELS } from '../../utils/constants';
import { formatDateTime } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import AppointmentForm from '../../components/forms/AppointmentForm';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [dentistFilter, setDentistFilter] = useState('');

  const createModal = useModal();
  const editModal = useModal();
  const deleteDialog = useModal();
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', { search, page, status: statusFilter, dentist: dentistFilter }],
    queryFn: () => appointmentService.getAll({ 
      search, 
      page, 
      limit: 10, 
      status: statusFilter,
      dentist: dentistFilter,
    }),
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientService.getAll({ limit: 1000 }),
    enabled: createModal.isOpen || editModal.isOpen,
  });

  const { data: dentistsData } = useQuery({
    queryKey: ['dentists-list'],
    queryFn: () => dentistService.getAll({ limit: 100 }),
    enabled: createModal.isOpen || editModal.isOpen,
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services-list'],
    queryFn: () => serviceService.getAll({ limit: 100 }),
    enabled: createModal.isOpen || editModal.isOpen,
  });

  const patients = patientsData?.data || [];
  const dentists = dentistsData?.data || [];
  const services = servicesData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      createModal.close();
      setToast({ isVisible: true, message: 'Appointment created successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create appointment', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => appointmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      editModal.close();
      setToast({ isVisible: true, message: 'Appointment updated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update appointment', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => appointmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      deleteDialog.close();
      setToast({ isVisible: true, message: 'Appointment cancelled successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to cancel appointment', type: 'error' });
    },
  });

  const quickStatusMutation = useMutation({
    mutationFn: ({ id, status }) => appointmentService.update(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['appointments']);
      setToast({ 
        isVisible: true, 
        message: `Appointment marked as ${APPOINTMENT_STATUS_LABELS[variables.status]}`, 
        type: 'success' 
      });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update status', type: 'error' });
    },
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
          <span>{new Date(row.startDateTime).toLocaleDateString()}</span>
          <Clock size={14} className="appointment-icon" />
          <span>{new Date(row.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {APPOINTMENT_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="action-buttons">
          {row.status === 'scheduled' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => quickStatusMutation.mutate({ id: row._id, status: 'confirmed' })}
              title="Confirm"
            >
              <CheckCircle size={14} />
            </Button>
          )}
          {row.status === 'confirmed' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => quickStatusMutation.mutate({ id: row._id, status: 'in_progress' })}
              title="Start"
            >
              <Clock size={14} />
            </Button>
          )}
          {row.status === 'in_progress' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => quickStatusMutation.mutate({ id: row._id, status: 'completed' })}
              title="Complete"
            >
              <CheckCircle size={14} />
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => editModal.open(row)}
            title="Edit"
          >
            <Edit size={14} />
          </Button>
          {(row.status === 'scheduled' || row.status === 'confirmed') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteDialog.open(row)}
              title="Cancel"
            >
              <XCircle size={14} />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleCreate = (formData) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (formData) => {
    updateMutation.mutate({ id: editModal.data._id, data: formData });
  };

  const handleDelete = () => {
    if (deleteDialog.data) {
      deleteMutation.mutate(deleteDialog.data._id);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage daily schedules and patient visits.</p>
        </div>
        <div className="page-header__actions">
          <Button 
            variant="secondary"
            onClick={() => navigate('/dashboard/appointments/calendar')}
          >
            <Calendar size={18} />
            Calendar View
          </Button>
          <Button variant="primary" onClick={() => createModal.open()}>
            <Plus size={18} /> New Appointment
          </Button>
        </div>
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
        <div className="filters">
          <Select
            options={[
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'no_show', label: 'No Show' },
            ]}
            placeholder="All Statuses"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={[
              { value: '', label: 'All Dentists' },
              ...dentists.map(d => ({
                value: d._id,
                label: `Dr. ${d.user?.firstName} ${d.user?.lastName}`,
              })),
            ]}
            placeholder="All Dentists"
            value={dentistFilter}
            onChange={(e) => setDentistFilter(e.target.value)}
          />
        </div>
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

      {/* Create Appointment Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="New Appointment"
        size="lg"
      >
        <AppointmentForm
          patients={patients}
          dentists={dentists}
          services={services}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Appointment"
        size="lg"
      >
        {editModal.data && (
          <AppointmentForm
            initialData={editModal.data}
            patients={patients}
            dentists={dentists}
            services={services}
            onSubmit={handleUpdate}
            isLoading={updateMutation.isPending}
            onCancel={editModal.close}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.close}
        onConfirm={handleDelete}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel this appointment for ${deleteDialog.data?.patient?.firstName} ${deleteDialog.data?.patient?.lastName}?`}
        confirmText="Cancel Appointment"
        isLoading={deleteMutation.isPending}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Appointments;