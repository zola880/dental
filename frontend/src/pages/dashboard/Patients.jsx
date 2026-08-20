import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Search, Plus, User, Eye, Edit, Trash2 } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import PatientForm from '../../components/forms/PatientForm';
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const createModal = useModal();
  const editModal = useModal();
  const deleteDialog = useModal();
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', { search, page }],
    queryFn: () => patientService.getAll({ search, page, limit: 10 }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      createModal.close();
      setToast({ isVisible: true, message: 'Patient created successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create patient', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => patientService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      editModal.close();
      setToast({ isVisible: true, message: 'Patient updated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update patient', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => patientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      deleteDialog.close();
      setToast({ isVisible: true, message: 'Patient deactivated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to deactivate patient', type: 'error' });
    },
  });

  const columns = [
    {
      key: 'name',
      header: 'Patient Name',
      render: (row) => (
        <div className="patient-name">
          <div className="patient-avatar">
            <User size={16} />
          </div>
          <div>
            <div className="patient-fullname">{row.firstName} {row.lastName}</div>
            <div className="patient-email">{row.email || 'No email provided'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (row) => row.phone,
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (row) => (
        <span style={{ textTransform: 'capitalize' }}>{row.gender}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'active' ? 'success' : 'default'}>
          {row.status}
        </Badge>
      ),
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
            onClick={() => navigate(`/dashboard/patients/${row._id}`)}
          >
            <Eye size={14} />
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => editModal.open(row)}
          >
            <Edit size={14} />
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => deleteDialog.open(row)}
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
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and view all registered patients.</p>
        </div>
        <Button variant="primary" onClick={() => createModal.open()}>
          <Plus size={18} /> Add New Patient
        </Button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search by name, phone, or email..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">Failed to load patients. Please try again.</div>}

      <Table 
        columns={columns} 
        data={data?.data || []} 
        isLoading={isLoading} 
        emptyMessage="No patients found matching your criteria."
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

      {/* Create Patient Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Add New Patient"
        size="lg"
      >
        <PatientForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Patient"
        size="lg"
      >
        {editModal.data && (
          <PatientForm
            initialData={editModal.data}
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
        title="Deactivate Patient"
        message={`Are you sure you want to deactivate ${deleteDialog.data?.firstName} ${deleteDialog.data?.lastName}? This will mark their record as inactive.`}
        confirmText="Deactivate"
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

export default Patients;