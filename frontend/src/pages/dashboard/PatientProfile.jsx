import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  AlertCircle,
  FileText,
  Clock,
  Stethoscope,
  Receipt,
  ArrowLeft,
  Edit,
  Droplet,
  Activity,
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { treatmentService } from '../../services/treatmentService';
import { invoiceService } from '../../services/invoiceService';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Table from '../../components/ui/Table';
import './PatientProfile.css';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: patientData, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
    enabled: !!id,
  });

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['patient-appointments', id],
    queryFn: () => appointmentService.getAll({ patient: id, limit: 50 }),
    enabled: !!id && activeTab === 'appointments',
  });

  const { data: treatmentsData, isLoading: treatmentsLoading } = useQuery({
    queryKey: ['patient-treatments', id],
    queryFn: () => treatmentService.getAll({ patient: id, limit: 50 }),
    enabled: !!id && activeTab === 'treatments',
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['patient-invoices', id],
    queryFn: () => invoiceService.getAll({ patient: id, limit: 50 }),
    enabled: !!id && activeTab === 'billing',
  });

  const patient = patientData?.data?.patient;

  if (patientLoading) {
    return (
      <div className="patient-profile-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-profile-error">
        <EmptyState
          icon={AlertCircle}
          title="Patient Not Found"
          description="The patient you're looking for doesn't exist or has been removed."
          action={
            <Button variant="primary" onClick={() => navigate('/dashboard/patients')}>
              Back to Patients
            </Button>
          }
        />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'treatments', label: 'Treatments', icon: Stethoscope },
    { id: 'billing', label: 'Billing', icon: Receipt },
  ];

  const appointmentColumns = [
    {
      key: 'date',
      header: 'Date & Time',
      render: (row) => (
        <div className="datetime-cell">
          <Calendar size={14} />
          <span>{formatDateTime(row.startDateTime)}</span>
        </div>
      ),
    },
    {
      key: 'dentist',
      header: 'Dentist',
      render: (row) => `Dr. ${row.dentist?.user?.firstName || ''} ${row.dentist?.user?.lastName || ''}`,
    },
    {
      key: 'service',
      header: 'Service',
      render: (row) => row.service?.name || 'General Consultation',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'completed' ? 'success' : row.status === 'cancelled' ? 'danger' : 'info'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
  ];

  const treatmentColumns = [
    {
      key: 'title',
      header: 'Treatment',
      render: (row) => (
        <div className="treatment-cell">
          <Stethoscope size={14} />
          <span>{row.title}</span>
        </div>
      ),
    },
    {
      key: 'dentist',
      header: 'Dentist',
      render: (row) => `Dr. ${row.dentist?.user?.firstName || ''} ${row.dentist?.user?.lastName || ''}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'completed' ? 'success' : row.status === 'in_progress' ? 'warning' : 'info'}>
          {row.status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'cost',
      header: 'Cost',
      align: 'right',
      render: (row) => formatCurrency(row.estimatedCost),
    },
  ];

  const invoiceColumns = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      render: (row) => (
        <span className="invoice-number-cell">{row.invoiceNumber}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (row) => formatCurrency(row.totalAmount),
    },
    {
      key: 'paid',
      header: 'Paid',
      align: 'right',
      render: (row) => formatCurrency(row.paidAmount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variantMap = {
          paid: 'success',
          partially_paid: 'info',
          pending: 'warning',
          draft: 'default',
          cancelled: 'danger',
        };
        return (
          <Badge variant={variantMap[row.status] || 'default'}>
            {row.status.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="patient-profile">
      <div className="patient-profile__header">
        <button className="patient-profile__back" onClick={() => navigate('/dashboard/patients')}>
          <ArrowLeft size={18} />
          Back to Patients
        </button>
      </div>

      <Card padding="lg" className="patient-profile__info-card">
        <div className="patient-profile__info">
          <div className="patient-profile__avatar">
            <User size={32} />
          </div>
          <div className="patient-profile__details">
            <div className="patient-profile__name-row">
              <h1 className="patient-profile__name">
                {patient.firstName} {patient.lastName}
              </h1>
              <Badge variant={patient.status === 'active' ? 'success' : 'default'}>
                {patient.status}
              </Badge>
            </div>
            <div className="patient-profile__meta">
              <span className="patient-profile__meta-item">
                <Calendar size={14} />
                {formatDate(patient.dateOfBirth)} ({Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))} yrs)
              </span>
              <span className="patient-profile__meta-item">
                <Heart size={14} />
                {patient.gender}
              </span>
              {patient.bloodGroup && patient.bloodGroup !== 'Unknown' && (
                <span className="patient-profile__meta-item">
                  <Droplet size={14} />
                  {patient.bloodGroup}
                </span>
              )}
            </div>
            <div className="patient-profile__contact">
              <a href={`tel:${patient.phone}`} className="patient-profile__contact-item">
                <Phone size={14} />
                {patient.phone}
              </a>
              {patient.email && (
                <a href={`mailto:${patient.email}`} className="patient-profile__contact-item">
                  <Mail size={14} />
                  {patient.email}
                </a>
              )}
              {patient.address?.city && (
                <span className="patient-profile__contact-item">
                  <MapPin size={14} />
                  {patient.address.city}{patient.address.state ? `, ${patient.address.state}` : ''}
                </span>
              )}
            </div>
          </div>
          <div className="patient-profile__actions">
            <Button variant="secondary">
              <Edit size={16} />
              Edit Patient
            </Button>
          </div>
        </div>

        {patient.allergies && (
          <div className="patient-profile__alert">
            <AlertCircle size={16} />
            <div>
              <strong>Allergies:</strong> {patient.allergies}
            </div>
          </div>
        )}

        {patient.emergencyContact?.name && (
          <div className="patient-profile__emergency">
            <Activity size={16} />
            <div>
              <strong>Emergency Contact:</strong> {patient.emergencyContact.name}
              {patient.emergencyContact.relationship && ` (${patient.emergencyContact.relationship})`}
              {patient.emergencyContact.phone && ` — ${patient.emergencyContact.phone}`}
            </div>
          </div>
        )}
      </Card>

      <div className="patient-profile__tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`patient-profile__tab ${activeTab === tab.id ? 'patient-profile__tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="patient-profile__content">
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <Card padding="lg">
              <h3 className="card-section-title">
                <FileText size={18} />
                Personal Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">{formatDate(patient.dateOfBirth)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{patient.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Blood Group</span>
                  <span className="info-value">{patient.bloodGroup}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{patient.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{patient.email || 'Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Registered</span>
                  <span className="info-value">{formatDate(patient.createdAt)}</span>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="card-section-title">
                <MapPin size={18} />
                Address
              </h3>
              {patient.address?.street ? (
                <div className="address-block">
                  <p>{patient.address.street}</p>
                  <p>
                    {patient.address.city}
                    {patient.address.state && `, ${patient.address.state}`}
                    {patient.address.zipCode && ` ${patient.address.zipCode}`}
                  </p>
                  <p>{patient.address.country}</p>
                </div>
              ) : (
                <p className="empty-text">No address on file.</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'appointments' && (
          <Card padding="lg">
            <h3 className="card-section-title">
              <Calendar size={18} />
              Appointment History
            </h3>
            <Table
              columns={appointmentColumns}
              data={appointmentsData?.data || []}
              isLoading={appointmentsLoading}
              emptyMessage="No appointments found for this patient."
            />
          </Card>
        )}

        {activeTab === 'treatments' && (
          <Card padding="lg">
            <h3 className="card-section-title">
              <Stethoscope size={18} />
              Treatment History
            </h3>
            <Table
              columns={treatmentColumns}
              data={treatmentsData?.data || []}
              isLoading={treatmentsLoading}
              emptyMessage="No treatments found for this patient."
            />
          </Card>
        )}

        {activeTab === 'billing' && (
          <Card padding="lg">
            <h3 className="card-section-title">
              <Receipt size={18} />
              Billing History
            </h3>
            <Table
              columns={invoiceColumns}
              data={invoicesData?.data || []}
              isLoading={invoicesLoading}
              emptyMessage="No invoices found for this patient."
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;