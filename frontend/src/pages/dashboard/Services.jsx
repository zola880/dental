import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../../services/serviceService';
import { Search, Plus, Stethoscope, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Toast from '../../components/ui/Toast';
import './Services.css';

const Services = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['services', { search, category: categoryFilter, page }],
    queryFn: () => serviceService.getAll({ search, category: categoryFilter, page, limit: 20 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => serviceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
      setIsDeleteDialogOpen(false);
      setToast({ isVisible: true, message: 'Service deactivated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to deactivate service', type: 'error' });
    },
  });

  const columns = [
    {
      key: 'name',
      header: 'Service Name',
      render: (row) => (
        <div className="service-info">
          <Stethoscope size={18} className="service-icon" />
          <div>
            <div className="service-name">{row.name}</div>
            <div className="service-description">{row.description || 'No description'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <Badge variant="primary">
          {row.category || 'General'}
        </Badge>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (row) => (
        <div className="service-duration">
          <Clock size={14} />
          <span>{row.duration} min</span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (row) => (
        <div className="service-price">
          <DollarSign size={14} />
          <span>{formatCurrency(row.price)}</span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="action-buttons">
          <Button variant="secondary" size="sm">
            Edit
          </Button>
          {user?.role === 'admin' && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setSelectedService(row);
                setIsDeleteDialogOpen(true);
              }}
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    if (selectedService) {
      deleteMutation.mutate(selectedService._id);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle">Manage clinic services, pricing, and availability.</p>
        </div>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Service
          </Button>
        )}
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search services..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: 'preventive', label: 'Preventive' },
            { value: 'cosmetic', label: 'Cosmetic' },
            { value: 'restorative', label: 'Restorative' },
            { value: 'surgical', label: 'Surgical' },
            { value: 'orthodontics', label: 'Orthodontics' },
            { value: 'pediatric', label: 'Pediatric' },
            { value: 'emergency', label: 'Emergency' },
          ]}
          placeholder="All Categories"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      {error && <div className="error-message">Failed to load services.</div>}

      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No services found."
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

      {/* Add Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Service"
        size="md"
      >
        <div className="add-service-form">
          <p className="modal-description">
            Service creation form will be implemented here.
          </p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Service
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Deactivate Service"
        message={`Are you sure you want to deactivate "${selectedService?.name}"? This service will no longer be available for appointments.`}
        confirmText="Deactivate"
        isLoading={deleteMutation.isPending}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Services;