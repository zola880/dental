import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { treatmentService } from '../../services/treatmentService';
import { Search, Plus, Stethoscope } from 'lucide-react';
import { TREATMENT_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['treatments', { search, page, status: statusFilter }],
    queryFn: () => treatmentService.getAll({ search, page, limit: 10, status: statusFilter }),
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
          {TREATMENT_STATUS_LABELS[row.status]}
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
      render: () => (
        <Button variant="secondary" size="sm">View Details</Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Treatments</h1>
          <p className="page-subtitle">Manage treatment plans and track progress.</p>
        </div>
        <Button variant="primary">
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
    </div>
  );
};

export default Treatments;