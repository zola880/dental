import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Search, Plus, User, Eye, Edit } from 'lucide-react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PatientFormModal from '../../components/modals/PatientFormModal';
import './Patients.css';

const Patients = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
      render: (row) => (
        <div className="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/dashboard/patients/${row._id}`)}
          >
            <Eye size={14} /> View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedPatient(row);
              setIsModalOpen(true);
            }}
          >
            <Edit size={14} /> Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage and view all registered patients.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
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

      <PatientFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        patient={selectedPatient}
      />
    </div>
  );
};

export default Patients;