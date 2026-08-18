import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../services/patientService';
import { Search, Plus, User } from 'lucide-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './Patients.css';

const Patients = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', { search, page }],
    queryFn: () => patientService.getAll({ search, page, limit: 10 }),
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
      render: (row) => row.gender,
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
      render: () => (
        <Button variant="secondary" size="sm">View Profile</Button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and view all registered patients.</p>
        </div>
        <Button variant="primary">
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
    </div>
  );
};

export default Patients;