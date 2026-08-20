import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditService } from '../../services/auditService';
import { Search, Shield, Calendar, User, FileText, Activity } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import './AuditLogs.css';

const getActionVariant = (action) => {
  const map = {
    CREATE: 'success',
    UPDATE: 'info',
    DELETE: 'danger',
    LOGIN: 'primary',
    LOGOUT: 'default',
    VIEW: 'default',
  };
  return map[action] || 'default';
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['audit-logs', { search, page, action: actionFilter, entity: entityFilter }],
    queryFn: () => auditService.getAll({ 
      search, 
      page, 
      limit: 15, 
      action: actionFilter,
      entity: entityFilter,
    }),
  });

  const logs = data?.data || [];
  const meta = data?.meta || {};

  const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'VIEW', label: 'View' },
  ];

  const entityOptions = [
    { value: '', label: 'All Entities' },
    { value: 'User', label: 'User' },
    { value: 'Patient', label: 'Patient' },
    { value: 'Appointment', label: 'Appointment' },
    { value: 'Treatment', label: 'Treatment' },
    { value: 'Invoice', label: 'Invoice' },
    { value: 'Payment', label: 'Payment' },
    { value: 'Expense', label: 'Expense' },
    { value: 'ClinicSetting', label: 'Settings' },
  ];

  const columns = [
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (row) => (
        <div className="audit-date">
          <Calendar size={14} />
          <span>{formatDateTime(row.timestamp)}</span>
        </div>
      ),
    },
    {
      key: 'user',
      header: 'User',
      render: (row) => (
        <div className="audit-user">
          <User size={14} />
          <span>{row.user ? `${row.user.firstName} ${row.user.lastName}` : 'System'}</span>
          {row.user?.role && <Badge variant="default" className="audit-role">{row.user.role}</Badge>}
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <Badge variant={getActionVariant(row.action)}>
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'entity',
      header: 'Entity',
      render: (row) => (
        <div className="audit-entity">
          <FileText size={14} />
          <span>{row.entity}</span>
          {row.entityId && <span className="audit-entity-id">ID: {row.entityId.slice(-6)}</span>}
        </div>
      ),
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (row) => (
        <span className="audit-ip">{row.ipAddress || 'Unknown'}</span>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="page-subtitle">Track all system activities and user actions for security and compliance.</p>
        </div>
      </div>

      <div className="page-controls">
        <div className="search-box">
          <Input
            placeholder="Search by user or entity ID..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <Select
            options={actionOptions}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            placeholder="Filter by Action"
          />
          <Select
            options={entityOptions}
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            placeholder="Filter by Entity"
          />
        </div>
      </div>

      {error && <div className="error-message">Failed to load audit logs.</div>}

      <div className="audit-notice">
        <Shield size={18} />
        <span>Audit logs are immutable and retained for compliance purposes. Only administrators can view this data.</span>
      </div>

      <Table
        columns={columns}
        data={logs}
        isLoading={isLoading}
        emptyMessage="No audit logs found matching your criteria."
      />

      {meta.totalPages > 1 && (
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
            Page {page} of {meta.totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === meta.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;