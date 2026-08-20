import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import './AppointmentForm.css';

const appointmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dentist: z.string().min(1, 'Dentist is required'),
  service: z.string().optional(),
  startDateTime: z.string().min(1, 'Start date and time are required'),
  endDateTime: z.string().min(1, 'End date and time are required'),
  type: z.string().min(1, 'Appointment type is required'),
  status: z.string().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => new Date(data.endDateTime) > new Date(data.startDateTime),
  {
    message: 'End time must be after start time',
    path: ['endDateTime'],
  }
);

const AppointmentForm = ({ 
  initialData = {}, 
  patients = [], 
  dentists = [], 
  services = [],
  onSubmit, 
  isLoading, 
  onCancel 
}) => {
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient: initialData.patient?._id || initialData.patient || '',
      dentist: initialData.dentist?._id || initialData.dentist || '',
      service: initialData.service?._id || initialData.service || '',
      startDateTime: formatDateTimeLocal(initialData.startDateTime),
      endDateTime: formatDateTimeLocal(initialData.endDateTime),
      type: initialData.type || 'checkup',
      status: initialData.status || 'scheduled',
      notes: initialData.notes || '',
    },
  });

  const patientOptions = patients.map(p => ({
    value: p._id,
    label: `${p.firstName} ${p.lastName} (${p.phone})`,
  }));

  const dentistOptions = dentists.map(d => ({
    value: d._id,
    label: `Dr. ${d.user?.firstName} ${d.user?.lastName} - ${d.specialization}`,
  }));

  const serviceOptions = services.map(s => ({
    value: s._id,
    label: `${s.name} (${s.duration} min)`,
  }));

  const typeOptions = [
    { value: 'checkup', label: 'Checkup' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'procedure', label: 'Procedure' },
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="appointment-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <User size={18} />
          Patient & Dentist
        </h4>
        <FormRow columns={2}>
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
        </FormRow>
        <Select
          label="Service"
          options={serviceOptions}
          placeholder="Select service (optional)"
          error={errors.service?.message}
          {...register('service')}
        />
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <Calendar size={18} />
          Schedule
        </h4>
        <FormRow columns={2}>
          <Input
            label="Start Date & Time *"
            type="datetime-local"
            icon={Calendar}
            error={errors.startDateTime?.message}
            {...register('startDateTime')}
          />
          <Input
            label="End Date & Time *"
            type="datetime-local"
            icon={Clock}
            error={errors.endDateTime?.message}
            {...register('endDateTime')}
          />
        </FormRow>
        <FormRow columns={2}>
          <Select
            label="Appointment Type *"
            options={typeOptions}
            placeholder="Select type"
            error={errors.type?.message}
            {...register('type')}
          />
          <Select
            label="Status"
            options={statusOptions}
            placeholder="Select status"
            error={errors.status?.message}
            {...register('status')}
          />
        </FormRow>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <Stethoscope size={18} />
          Notes
        </h4>
        <div className="input-group">
          <label className="input__label">Appointment Notes</label>
          <textarea
            className="input__field appointment-textarea"
            placeholder="Any special instructions or notes about this appointment..."
            rows={4}
            {...register('notes')}
          />
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Appointment' : 'Create Appointment'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;