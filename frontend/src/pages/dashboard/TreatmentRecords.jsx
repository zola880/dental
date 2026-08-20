import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { treatmentService } from '../../services/treatmentService';
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';
import { 
  ArrowLeft, 
  Plus, 
  Stethoscope, 
  Calendar, 
  DollarSign,
  User,
  FileText
} from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import TreatmentRecordForm from '../../components/forms/TreatmentRecordForm';
import './TreatmentRecords.css';

const TreatmentRecords = () => {
  const { treatmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const addRecordModal = useModal();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data: treatmentData, isLoading: treatmentLoading } = useQuery({
    queryKey: ['treatment', treatmentId],
    queryFn: () => treatmentService.getById(treatmentId),
  });

  const { data: recordsData, isLoading: recordsLoading } = useQuery({
    queryKey: ['treatment-records', treatmentId],
    queryFn: () => treatmentService.getRecords(treatmentId),
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-list'],
    queryFn: () => patientService.getAll({ limit: 1000 }),
    enabled: addRecordModal.isOpen,
  });

  const { data: dentistsData } = useQuery({
    queryKey: ['dentists-list'],
    queryFn: () => dentistService.getAll({ limit: 100 }),
    enabled: addRecordModal.isOpen,
  });

  const treatment = treatmentData?.data?.treatment;
  const records = recordsData?.data?.records || [];
  const patients = patientsData?.data || [];
  const dentists = dentistsData?.data || [];

  const addRecordMutation = useMutation({
    mutationFn: (data) => treatmentService.addRecord(treatmentId, {
      ...data,
      treatment: treatmentId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatment-records', treatmentId]);
      addRecordModal.close();
      setToast({ isVisible: true, message: 'Treatment record added successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to add record', type: 'error' });
    },
  });

  const handleAddRecord = (formData) => {
    addRecordMutation.mutate(formData);
  };

  if (treatmentLoading) {
    return (
      <div className="records-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="records-error">
        <p>Treatment not found</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard/treatments')}>
          Back to Treatments
        </Button>
      </div>
    );
  }

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  return (
    <div className="records-page">
      <div className="records-header">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/dashboard/treatments')}
        >
          <ArrowLeft size={16} />
          Back to Treatments
        </Button>
      </div>

      <Card padding="lg" className="treatment-summary">
        <div className="treatment-summary__header">
          <div className="treatment-summary__icon">
            <Stethoscope size={24} />
          </div>
          <div className="treatment-summary__info">
            <h1 className="treatment-summary__title">{treatment.title}</h1>
            <div className="treatment-summary__meta">
              <span className="treatment-summary__meta-item">
                <User size={14} />
                {treatment.patient?.firstName} {treatment.patient?.lastName}
              </span>
              <span className="treatment-summary__meta-item">
                <Stethoscope size={14} />
                Dr. {treatment.dentist?.user?.firstName} {treatment.dentist?.user?.lastName}
              </span>
              <Badge variant={
                treatment.status === 'completed' ? 'success' :
                treatment.status === 'cancelled' ? 'danger' :
                treatment.status === 'in_progress' ? 'warning' : 'info'
              }>
                {treatment.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        {treatment.description && (
          <p className="treatment-summary__description">{treatment.description}</p>
        )}

        <div className="treatment-summary__stats">
          <div className="treatment-summary__stat">
            <span className="treatment-summary__stat-label">Estimated Cost</span>
            <span className="treatment-summary__stat-value">
              {formatCurrency(treatment.estimatedCost)}
            </span>
          </div>
          <div className="treatment-summary__stat">
            <span className="treatment-summary__stat-label">Actual Cost</span>
            <span className="treatment-summary__stat-value">
              {formatCurrency(totalCost)}
            </span>
          </div>
          <div className="treatment-summary__stat">
            <span className="treatment-summary__stat-label">Procedures Done</span>
            <span className="treatment-summary__stat-value">{records.length}</span>
          </div>
          <div className="treatment-summary__stat">
            <span className="treatment-summary__stat-label">Start Date</span>
            <span className="treatment-summary__stat-value">
              {treatment.startDate ? formatDate(treatment.startDate) : '-'}
            </span>
          </div>
        </div>
      </Card>

      <div className="records-section">
        <div className="records-section__header">
          <h2 className="records-section__title">
            <FileText size={20} />
            Treatment Records ({records.length})
          </h2>
          <Button variant="primary" onClick={() => addRecordModal.open()}>
            <Plus size={18} />
            Add Record
          </Button>
        </div>

        {recordsLoading ? (
          <div className="records-loading">
            <LoadingSpinner />
          </div>
        ) : records.length === 0 ? (
          <div className="records-empty">
            <FileText size={48} />
            <h3>No treatment records yet</h3>
            <p>Start adding procedures to track this treatment's progress.</p>
            <Button variant="primary" onClick={() => addRecordModal.open()}>
              <Plus size={18} />
              Add First Record
            </Button>
          </div>
        ) : (
          <div className="records-list">
            {records.map((record) => (
              <Card key={record._id} padding="md" className="record-card">
                <div className="record-card__header">
                  <div className="record-card__title">
                    <Stethoscope size={18} />
                    <h3>{record.procedureName}</h3>
                    {record.toothNumber && (
                      <Badge variant="primary">Tooth {record.toothNumber}</Badge>
                    )}
                  </div>
                  <div className="record-card__meta">
                    <span className="record-card__date">
                      <Calendar size={14} />
                      {formatDate(record.date)}
                    </span>
                    <span className="record-card__cost">
                      <DollarSign size={14} />
                      {formatCurrency(record.cost)}
                    </span>
                  </div>
                </div>
                {record.notes && (
                  <p className="record-card__notes">{record.notes}</p>
                )}
                <div className="record-card__footer">
                  <span className="record-card__dentist">
                    Dr. {record.dentist?.firstName} {record.dentist?.lastName}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      <Modal
        isOpen={addRecordModal.isOpen}
        onClose={addRecordModal.close}
        title="Add Treatment Record"
        size="lg"
      >
        <TreatmentRecordForm
          initialData={{
            patient: treatment.patient?._id,
            dentist: treatment.dentist?._id,
          }}
          patients={patients}
          dentists={dentists}
          onSubmit={handleAddRecord}
          isLoading={addRecordMutation.isPending}
          onCancel={addRecordModal.close}
        />
      </Modal>

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

export default TreatmentRecords;