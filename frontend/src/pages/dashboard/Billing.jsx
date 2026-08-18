import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '../../services/invoiceService';
import { Search, Plus, Receipt } from 'lucide-react';
import { INVOICE_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices', { search, page, status: statusFilter }],
    queryFn: () => invoiceService.getAll({ search, page, limit: 10, status: statusFilter }),
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
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'paidAmount',
      header: 'Paid',
      align: 'right',
      render: (row) => formatCurrency(row.paidAmount),
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
      render: () => (
        <Button variant="secondary" size="sm">View</Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing</h1>
          <p className="page-subtitle">Manage invoices and track payments.</p>
        </div>
        <Button variant="primary">
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
    </div>
  );
};

export default Billing;