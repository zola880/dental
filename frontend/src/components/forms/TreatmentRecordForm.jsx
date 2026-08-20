import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stethoscope, Calendar, DollarSign, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import './TreatmentRecordForm.css';

const treatmentRecordSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dentist: z.string().min(1, 'Dentist is required'),
  procedureName: z.string().min(3, 'Procedure name must be at least 3 characters'),
  toothNumber: z.string().optional(),
  notes: z.string().optional(),
  cost: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

const TreatmentRecordForm = ({ 
  initialData = {}, 
  patients = [], 
  dentists = [],
  onSubmit, 
  isLoading, 
  onCancel 
}) => {
  const formatDateLocal = (dateString) => {
    if (!dateString) return new Date().toISOString().split('T')[0];
    return new Date(dateString).toISOString().split('T')[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(treatmentRecordSchema),
    defaultValues: {
      patient: initialData.patient?._id || initialData.patient || '',
      dentist: initialData.dentist?._id || initialData.dentist || '',
      procedureName: initialData.procedureName || '',
      toothNumber: initialData.toothNumber || '',
      notes: initialData.notes || '',
      cost: initialData.cost?.toString() || '',
      date: formatDateLocal(initialData.date),
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="treatment-record-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <Stethoscope size={18} />
          Procedure Details
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
          label="Procedure Name *"
          placeholder="e.g., Composite Filling, Root Canal, Crown Placement"
          error={errors.procedureName?.message}
          {...register('procedureName')}
        />
        <FormRow columns={2}>
          <Input
            label="Tooth Number"
            placeholder="e.g., 14, 26, 31"
            error={errors.toothNumber?.message}
            {...register('toothNumber')}
          />
          <Input
            label="Procedure Date *"
            type="date"
            icon={Calendar}
            error={errors.date?.message}
            {...register('date')}
          />
        </FormRow>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <FileText size={18} />
          Clinical Notes & Cost
        </h4>
        <div className="input-group">
          <label className="input__label">Clinical Notes</label>
          <textarea
            className="input__field treatment-record-textarea"
            placeholder="Detailed clinical observations, findings, and recommendations..."
            rows={5}
            {...register('notes')}
          />
        </div>
        <Input
          label="Procedure Cost ($)"
          type="number"
          icon={DollarSign}
          placeholder="0.00"
          error={errors.cost?.message}
          {...register('cost')}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Record' : 'Add Record'}
        </Button>
      </div>
    </form>
  );
};

export default TreatmentRecordForm;