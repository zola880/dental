import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  Activity,
  FileText,
  ArrowLeft,
  Edit,
  AlertCircle
} from 'lucide-react';
import { patientService } from '../../services/patientService';
import { formatDate, formatRelativeDate } from '../../utils/formatDate';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import './PatientProfile.css';

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => patientService.getById(id),
  });

  const { data: statsData } = useQuery({
    queryKey: ['patient-stats', id],
    queryFn: () => patientService.getStats(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="patient-profile-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-profile-error">
        <AlertCircle size={48} />
        <h3>Failed to load patient</h3>
        <p>{error.message}</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard/patients')}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const patient = data?.data?.patient;
  const stats = statsData?.data || {};

  if (!patient) {
    return (
      <div className="patient-profile-error">
        <p>Patient not found</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard/patients')}>
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="patient-profile">
      <div className="patient-profile__header">
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => navigate('/dashboard/patients')}
        >
          <ArrowLeft size={16} />
          Back to Patients
        </Button>
        <Button variant="primary" size="sm">
          <Edit size={16} />
          Edit Patient
        </Button>
      </div>

      <div className="patient-profile__top">
        <Card padding="lg" className="patient-profile__info-card">
          <div className="patient-profile__avatar">
            <User size={32} />
          </div>
          <div className="patient-profile__info">
            <h1 className="patient-profile__name">
              {patient.firstName} {patient.lastName}
            </h1>
            <div className="patient-profile__meta">
              <span className="patient-profile__meta-item">
                <Calendar size={14} />
                {formatDate(patient.dateOfBirth)}
              </span>
              <span className="patient-profile__meta-item">
                <Heart size={14} />
                {patient.bloodGroup}
              </span>
              <Badge variant={patient.status === 'active' ? 'success' : 'default'}>
                {patient.status}
              </Badge>
            </div>
          </div>
        </Card>

        <div className="patient-profile__stats">
          <Card padding="md" className="stat-mini">
            <Activity size={20} className="stat-mini__icon" />
            <div>
              <span className="stat-mini__value">{stats.totalAppointments || 0}</span>
              <span className="stat-mini__label">Appointments</span>
            </div>
          </Card>
          <Card padding="md" className="stat-mini">
            <FileText size={20} className="stat-mini__icon" />
            <div>
              <span className="stat-mini__value">{stats.totalTreatments || 0}</span>
              <span className="stat-mini__label">Treatments</span>
            </div>
          </Card>
          <Card padding="md" className="stat-mini">
            <Heart size={20} className="stat-mini__icon" />
            <div>
              <span className="stat-mini__value">{stats.medicalRecords || 0}</span>
              <span className="stat-mini__label">Records</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="patient-profile__grid">
        <Card padding="lg">
          <h3 className="profile-section__title">
            <Phone size={18} />
            Contact Information
          </h3>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">{patient.phone}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{patient.email || 'Not provided'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Gender</span>
              <span className="profile-info-value">{patient.gender}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Date of Birth</span>
              <span className="profile-info-value">{formatDate(patient.dateOfBirth)}</span>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="profile-section__title">
            <MapPin size={18} />
            Address
          </h3>
          {patient.address && (patient.address.street || patient.address.city) ? (
            <div className="profile-address">
              <p>{patient.address.street}</p>
              <p>
                {patient.address.city}
                {patient.address.state && `, ${patient.address.state}`}
                {patient.address.zipCode && ` ${patient.address.zipCode}`}
              </p>
              <p>{patient.address.country}</p>
            </div>
          ) : (
            <p className="profile-empty">No address on file</p>
          )}
        </Card>

        <Card padding="lg">
          <h3 className="profile-section__title">
            <Heart size={18} />
            Medical Information
          </h3>
          <div className="profile-info-list">
            <div className="profile-info-item">
              <span className="profile-info-label">Blood Group</span>
              <span className="profile-info-value">{patient.bloodGroup}</span>
            </div>
            <div className="profile-info-item profile-info-item--full">
              <span className="profile-info-label">Allergies</span>
              <span className="profile-info-value">
                {patient.allergies || 'None reported'}
              </span>
            </div>
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="profile-section__title">
            <AlertCircle size={18} />
            Emergency Contact
          </h3>
          {patient.emergencyContact?.name ? (
            <div className="profile-info-list">
              <div className="profile-info-item">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">
                  {patient.emergencyContact.name}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Phone</span>
                <span className="profile-info-value">
                  {patient.emergencyContact.phone || 'N/A'}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Relationship</span>
                <span className="profile-info-value">
                  {patient.emergencyContact.relationship || 'N/A'}
                </span>
              </div>
            </div>
          ) : (
            <p className="profile-empty">No emergency contact on file</p>
          )}
        </Card>
      </div>

      <div className="patient-profile__footer">
        <p className="patient-profile__timestamp">
          Patient record created {formatRelativeDate(patient.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default PatientProfile;