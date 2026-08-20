import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope, Calendar, DollarSign } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import './TreatmentForm.css';

const treatmentSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dentist: z.string().min(1, 'Dentist is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  estimatedCost: z.string().optional(),
});

const TreatmentForm = ({ 
  initialData = {}, 
  patients = [], 
  dentists = [],
  onSubmit, 
  isLoading, 
  onCancel 
}) => {
  const formatDateLocal = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      patient: initialData.patient?._id || initialData.patient || '',
      dentist: initialData.dentist?._id || initialData.dentist || '',
      title: initialData.title || '',
      description: initialData.description || '',
      status: initialData.status || 'planned',
      startDate: formatDateLocal(initialData.startDate),
      endDate: formatDateLocal(initialData.endDate),
      estimatedCost: initialData.estimatedCost?.toString() || '',
    },
  });

  const patientOptions = patients.map(p => ({
    value: p._id,
    label: `${p.firstName} ${p.lastName}`,
  }));

  const dentistOptions = dentists.map(d => ({
    value: d._id,
    label: `Dr. ${d.user?.firstName} ${d.user?.lastName}`,
  }));

  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="treatment-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <Stethoscope size={18} />
          Treatment Details
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
        <Input
          label="Treatment Title *"
          placeholder="e.g., Root Canal Treatment - Tooth 14"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="input-group">
          <label className="input__label">Description</label>
          <textarea
            className="input__field treatment-textarea"
            placeholder="Detailed description of the treatment plan..."
            rows={4}
            {...register('description')}
          />
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <Calendar size={18} />
          Schedule & Status
        </h4>
        <FormRow columns={3}>
          <Input
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="End Date"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
          <Select
            label="Status"
            options={statusOptions}
            placeholder="Select status"
            error={errors.status?.message}
            {...register('status')}
          />
        </FormRow>
        <Input
          label="Estimated Cost ($)"
          type="number"
          icon={DollarSign}
          placeholder="0.00"
          error={errors.estimatedCost?.message}
          {...register('estimatedCost')}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Treatment' : 'Create Treatment'}
        </Button>
      </div>
    </form>
  );
};

export default TreatmentForm;