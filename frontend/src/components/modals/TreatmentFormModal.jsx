import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { treatmentService } from '../../services/treatmentService';
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import './TreatmentFormModal.css';

const treatmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dentist: z.string().min(1, 'Dentist is required'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedCost: z.coerce.number().min(0, 'Must be positive').optional(),
});

const TreatmentFormModal = ({ isOpen, onClose, treatment = null, preselectedPatient = null }) => {
  const queryClient = useQueryClient();
  const isEdit = !!treatment;
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      patient: preselectedPatient || '',
      dentist: '',
      title: '',
      description: '',
      status: 'planned',
      startDate: '',
      endDate: '',
      estimatedCost: 0,
    },
  });

  const { data: patientsData } = useQuery({
    queryKey: ['patients-dropdown'],
    queryFn: () => patientService.getAll({ limit: 1000 }),
    enabled: isOpen,
  });

  const { data: dentistsData } = useQuery({
    queryKey: ['dentists-dropdown'],
    queryFn: () => dentistService.getAll({ limit: 100 }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (treatment) {
        reset({
          patient: treatment.patient?._id || '',
          dentist: treatment.dentist?._id || '',
          title: treatment.title || '',
          description: treatment.description || '',
          status: treatment.status || 'planned',
          startDate: treatment.startDate ? treatment.startDate.split('T')[0] : '',
          endDate: treatment.endDate ? treatment.endDate.split('T')[0] : '',
          estimatedCost: treatment.estimatedCost || 0,
        });
      } else {
        reset({
          patient: preselectedPatient || '',
          dentist: '',
          title: '',
          description: '',
          status: 'planned',
          startDate: '',
          endDate: '',
          estimatedCost: 0,
        });
      }
    }
  }, [isOpen, treatment, preselectedPatient, reset]);

  const createMutation = useMutation({
    mutationFn: (data) => treatmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatments']);
      setToast({ isVisible: true, message: 'Treatment plan created', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create treatment', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => treatmentService.update(treatment._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['treatments']);
      setToast({ isVisible: true, message: 'Treatment updated', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update treatment', type: 'error' });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      description: data.description || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const patientOptions = patientsData?.data?.map(p => ({
    value: p._id,
    label: `${p.firstName} ${p.lastName}`
  })) || [];

  const dentistOptions = dentistsData?.data?.map(d => ({
    value: d._id,
    label: `Dr. ${d.user?.firstName} ${d.user?.lastName}`
  })) || [];

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Treatment Plan' : 'Create Treatment Plan'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
            >
              {isEdit ? 'Save Changes' : 'Create Plan'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="treatment-form">
          <Select
            label="Patient *"
            options={patientOptions}
            placeholder="Select patient"
            error={errors.patient?.message}
            {...register('patient')}
          />
          <Select
            label="Dentist *"
            options={dentistOptions}
            placeholder="Select dentist"
            error={errors.dentist?.message}
            {...register('dentist')}
          />
          <Input
            label="Treatment Title *"
            placeholder="e.g., Root Canal Therapy"
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="input-group">
            <label className="input__label">Description</label>
            <textarea
              className="input__field treatment-textarea"
              placeholder="Detailed description of the treatment plan..."
              rows={3}
              {...register('description')}
            />
          </div>
          <div className="form-row form-row--3">
            <Select
              label="Status"
              options={statusOptions}
              placeholder="Select status"
              {...register('status')}
            />
            <Input
              label="Start Date"
              type="date"
              {...register('startDate')}
            />
            <Input
              label="End Date"
              type="date"
              {...register('endDate')}
            />
          </div>
          <Input
            label="Estimated Cost ($)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.estimatedCost?.message}
            {...register('estimatedCost')}
          />
        </form>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </>
  );
};

export default TreatmentFormModal;