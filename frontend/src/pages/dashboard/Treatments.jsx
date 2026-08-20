import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { treatmentService } from '../../services/treatmentService';
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';
import { Search, Plus, Stethoscope, Edit, Trash2, Eye, FileText } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { TREATMENT_STATUS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import TreatmentForm from '../../components/forms/TreatmentForm';
import './Treatments.css';

const getStatusVariant = (status) => {
  const map = {
    planned: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'default';
};

const Treatments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const createModal = useModal();
  const editModal = useModal();
  const deleteDialog = useModal();
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['treatments', { search, page, status: statusFilter }],
    queryFn: () => treatmentService.getAll({ search, page, limit: 10, status: statusFilter }),
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

  const patients = patientsData?.data || [];
  const dentists = dentistsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => treatmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatments']);
      createModal.close();
      setToast({ isVisible: true, message: 'Treatment created successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create treatment', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => treatmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatments']);
      editModal.close();
      setToast({ isVisible: true, message: 'Treatment updated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update treatment', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => treatmentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatments']);
      deleteDialog.close();
      setToast({ isVisible: true, message: 'Treatment cancelled successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to cancel treatment', type: 'error' });
    },
  });

  const columns = [
    {
      key: 'title',
      header: 'Treatment',
      render: (row) => (
        <div className="treatment-info">
          <Stethoscope size={16} className="treatment-icon" />
          <div>
            <div className="treatment-title">{row.title}</div>
            <div className="treatment-patient">
              {row.patient?.firstName} {row.patient?.lastName}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'dentist',
      header: 'Dentist',
      render: (row) => (
        <span>Dr. {row.dentist?.user?.firstName} {row.dentist?.user?.lastName}</span>
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
      key: 'estimatedCost',
      header: 'Estimated Cost',
      align: 'right',
      render: (row) => formatCurrency(row.estimatedCost),
    },
    {
      key: 'startDate',
      header: 'Start Date',
      render: (row) => row.startDate ? formatDate(row.startDate) : '-',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/dashboard/treatments/${row._id}/records`)}
            title="View Records"
          >
            <FileText size={14} />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => editModal.open(row)}
            title="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteDialog.open(row)}
            title="Cancel"
          >
            <Trash2 size={14} />
          </Button>
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
          <h1 className="page-title">Treatments</h1>
          <p className="page-subtitle">Manage treatment plans and track progress.</p>
        </div>
        <Button variant="primary" onClick={() => createModal.open()}>
          <Plus size={18} /> New Treatment
        </Button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search treatments..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: 'planned', label: 'Planned' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {error && <div className="error-message">Failed to load treatments.</div>}

      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No treatments found."
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

      {/* Create Treatment Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="New Treatment Plan"
        size="lg"
      >
        <TreatmentForm
          patients={patients}
          dentists={dentists}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Edit Treatment Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Treatment Plan"
        size="lg"
      >
        {editModal.data && (
          <TreatmentForm
            initialData={editModal.data}
            patients={patients}
            dentists={dentists}
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
        title="Cancel Treatment"
        message={`Are you sure you want to cancel the treatment "${deleteDialog.data?.title}"?`}
        confirmText="Cancel Treatment"
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

export default Treatments;