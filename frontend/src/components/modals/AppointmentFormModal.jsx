import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { dentistService } from '../../services/dentistService';
import { serviceService } from '../../services/serviceService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import './AppointmentFormModal.css';

const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dentist: z.string().min(1, 'Dentist is required'),
  service: z.string().optional(),
  startDateTime: z.string().min(1, 'Start date/time is required'),
  endDateTime: z.string().min(1, 'End date/time is required'),
  type: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => new Date(data.endDateTime) > new Date(data.startDateTime), {
  message: 'End time must be after start time',
  path: ['endDateTime'],
});

const AppointmentFormModal = ({ isOpen, onClose, appointment = null, preselectedPatient = null }) => {
  const queryClient = useQueryClient();
  const isEdit = !!appointment;
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: preselectedPatient || '',
      dentist: '',
      service: '',
      startDateTime: '',
      endDateTime: '',
      type: 'checkup',
      notes: '',
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

  const { data: servicesData } = useQuery({
    queryKey: ['services-dropdown'],
    queryFn: () => serviceService.getAll({ limit: 100 }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        reset({
          patient: appointment.patient?._id || '',
          dentist: appointment.dentist?._id || '',
          service: appointment.service?._id || '',
          startDateTime: appointment.startDateTime ? appointment.startDateTime.slice(0, 16) : '',
          endDateTime: appointment.endDateTime ? appointment.endDateTime.slice(0, 16) : '',
          type: appointment.type || 'checkup',
          notes: appointment.notes || '',
        });
      } else {
        reset({
          patient: preselectedPatient || '',
          dentist: '',
          service: '',
          startDateTime: '',
          endDateTime: '',
          type: 'checkup',
          notes: '',
        });
      }
    }
  }, [isOpen, appointment, preselectedPatient, reset]);

  const createMutation = useMutation({
    mutationFn: (data) => appointmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      setToast({ isVisible: true, message: 'Appointment created successfully', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create appointment', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => appointmentService.update(appointment._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      setToast({ isVisible: true, message: 'Appointment updated successfully', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update appointment', type: 'error' });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      ...data,
      service: data.service || undefined,
      notes: data.notes || undefined,
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
    label: `${p.firstName} ${p.lastName} (${p.phone})`
  })) || [];

  const dentistOptions = dentistsData?.data?.map(d => ({
    value: d._id,
    label: `Dr. ${d.user?.firstName} ${d.user?.lastName} - ${d.specialization}`
  })) || [];

  const serviceOptions = servicesData?.data?.map(s => ({
    value: s._id,
    label: `${s.name} (${s.duration} min)`
  })) || [];

  const typeOptions = [
    { value: 'checkup', label: 'Checkup' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'procedure', label: 'Procedure' },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Appointment' : 'Schedule Appointment'}
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
              {isEdit ? 'Save Changes' : 'Schedule'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
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
          <Select
            label="Service"
            options={serviceOptions}
            placeholder="Select service (optional)"
            {...register('service')}
          />
          <div className="form-row">
            <Input
              label="Start Date & Time *"
              type="datetime-local"
              error={errors.startDateTime?.message}
              {...register('startDateTime')}
            />
            <Input
              label="End Date & Time *"
              type="datetime-local"
              error={errors.endDateTime?.message}
              {...register('endDateTime')}
            />
          </div>
          <Select
            label="Appointment Type"
            options={typeOptions}
            placeholder="Select type"
            {...register('type')}
          />
          <div className="input-group">
            <label className="input__label">Notes</label>
            <textarea
              className="input__field appointment-textarea"
              placeholder="Any special notes about this appointment..."
              rows={3}
              {...register('notes')}
            />
          </div>
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

export default AppointmentFormModal;