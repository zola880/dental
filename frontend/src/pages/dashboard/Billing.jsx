import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { invoiceService } from '../../services/invoiceService';
import { patientService } from '../../services/patientService';
import { Search, Plus, Receipt, Eye, Edit, Trash2, DollarSign } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { INVOICE_STATUS_LABELS } from '../../utils/constants';
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
import InvoiceForm from '../../components/forms/InvoiceForm';
import './Billing.css';

const getStatusVariant = (status) => {
  const map = {
    draft: 'default',
    pending: 'warning',
    partially_paid: 'info',
    paid: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'default';
};

const Billing = () => {
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
    queryKey: ['invoices', { search, page, status: statusFilter }],
    queryFn: () => invoiceService.getAll({ search, page, limit: 10, status: statusFilter }),
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientService.getAll({ limit: 1000 }),
    enabled: createModal.isOpen || editModal.isOpen,
  });

  const patients = patientsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      createModal.close();
      setToast({ isVisible: true, message: 'Invoice created successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create invoice', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => invoiceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      editModal.close();
      setToast({ isVisible: true, message: 'Invoice updated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update invoice', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => invoiceService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      deleteDialog.close();
      setToast({ isVisible: true, message: 'Invoice cancelled successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to cancel invoice', type: 'error' });
    },
  });

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (row) => (
        <div className="invoice-info">
          <Receipt size={16} className="invoice-icon" />
          <span className="invoice-number">{row.invoiceNumber}</span>
        </div>
      ),
    },
    {
      key: 'patient',
      header: 'Patient',
      render: (row) => (
        <span>{row.patient?.firstName} {row.patient?.lastName}</span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      align: 'right',
      render: (row) => (
        <span className="invoice-amount">{formatCurrency(row.totalAmount)}</span>
      ),
    },
    {
      key: 'paidAmount',
      header: 'Paid',
      align: 'right',
      render: (row) => (
        <span className="invoice-amount invoice-amount--paid">
          {formatCurrency(row.paidAmount)}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Balance',
      align: 'right',
      render: (row) => {
        const balance = row.totalAmount - row.paidAmount;
        return (
          <span className={`invoice-amount ${balance > 0 ? 'invoice-amount--outstanding' : ''}`}>
            {formatCurrency(balance)}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {INVOICE_STATUS_LABELS[row.status]}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => formatDate(row.createdAt),
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
            onClick={() => navigate(`/dashboard/billing/${row._id}`)}
            title="View Details"
          >
            <Eye size={14} />
          </Button>
          {(row.status === 'draft' || row.status === 'pending') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => editModal.open(row)}
              title="Edit"
            >
              <Edit size={14} />
            </Button>
          )}
          {row.status !== 'paid' && row.status !== 'cancelled' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/dashboard/billing/${row._id}`)}
              title="Record Payment"
            >
              <DollarSign size={14} />
            </Button>
          )}
          {(row.status === 'draft' || row.status === 'pending') && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteDialog.open(row)}
              title="Cancel"
            >
              <Trash2 size={14} />
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
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Manage invoices and track payments.</p>
        </div>
        <Button variant="primary" onClick={() => createModal.open()}>
          <Plus size={18} /> Create Invoice
        </Button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search invoices..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'pending', label: 'Pending' },
            { value: 'partially_paid', label: 'Partially Paid' },
            { value: 'paid', label: 'Paid' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
          placeholder="All Statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {error && <div className="error-message">Failed to load invoices.</div>}

      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No invoices found."
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

      {/* Create Invoice Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Create Invoice"
        size="lg"
      >
        <InvoiceForm
          patients={patients}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Invoice"
        size="lg"
      >
        {editModal.data && (
          <InvoiceForm
            initialData={editModal.data}
            patients={patients}
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
        title="Cancel Invoice"
        message={`Are you sure you want to cancel invoice ${deleteDialog.data?.invoiceNumber}? This action cannot be undone.`}
        confirmText="Cancel Invoice"
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

export default Billing;