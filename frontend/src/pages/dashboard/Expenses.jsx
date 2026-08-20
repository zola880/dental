import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../../services/expenseService';
import { Search, Plus, Receipt, Edit, Trash2, Calendar } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
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
import ExpenseForm from '../../components/forms/ExpenseForm';
import './Expenses.css';

const Expenses = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);

  const createModal = useModal();
  const editModal = useModal();
  const deleteDialog = useModal();
  
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['expenses', { search, page, category: categoryFilter }],
    queryFn: () => expenseService.getAll({ search, page, limit: 10, category: categoryFilter }),
  });

  const createMutation = useMutation({
    mutationFn: (data) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      createModal.close();
      setToast({ isVisible: true, message: 'Expense recorded successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to record expense', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      editModal.close();
      setToast({ isVisible: true, message: 'Expense updated successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update expense', type: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => expenseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      deleteDialog.close();
      setToast({ isVisible: true, message: 'Expense deleted successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to delete expense', type: 'error' });
    },
  });

  const getCategoryLabel = (value) => {
    const cat = EXPENSE_CATEGORIES.find(c => c.value === value);
    return cat ? cat.label : value;
  };

  const columns = [
    {
      key: 'description',
      header: 'Description',
      render: (row) => (
        <div className="expense-info">
          <Receipt size={16} className="expense-icon" />
          <span className="expense-desc">{row.description}</span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <Badge variant="primary">
          {getCategoryLabel(row.category)}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      render: (row) => (
        <span className="expense-amount">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <div className="expense-date">
          <Calendar size={14} />
          <span>{formatDate(row.date)}</span>
        </div>
      ),
    },
    {
      key: 'recordedBy',
      header: 'Recorded By',
      render: (row) => (
        <span>{row.recordedBy?.firstName} {row.recordedBy?.lastName}</span>
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
            onClick={() => editModal.open(row)}
            title="Edit"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => deleteDialog.open(row)}
            title="Delete"
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
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and manage clinic expenses.</p>
        </div>
        <Button variant="primary" onClick={() => createModal.open()}>
          <Plus size={18} /> Record Expense
        </Button>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search expenses..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={EXPENSE_CATEGORIES}
          placeholder="All Categories"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      {error && <div className="error-message">Failed to load expenses.</div>}

      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        emptyMessage="No expenses found."
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

      {/* Create Expense Modal */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Record Expense"
        size="md"
      >
        <ExpenseForm
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Edit Expense"
        size="md"
      >
        {editModal.data && (
          <ExpenseForm
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
        title="Delete Expense"
        message={`Are you sure you want to delete the expense "${deleteDialog.data?.description}"? This action cannot be undone.`}
        confirmText="Delete"
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

export default Expenses;