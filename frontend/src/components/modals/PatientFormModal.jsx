import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../services/patientService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import { GENDER_OPTIONS, BLOOD_GROUPS } from '../../utils/constants';
import './PatientFormModal.css';

const patientSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  email: z.string().email('Valid email is required').or(z.literal('')).optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  'address.street': z.string().optional(),
  'address.city': z.string().optional(),
  'address.state': z.string().optional(),
  'address.zipCode': z.string().optional(),
  'address.country': z.string().optional(),
  'emergencyContact.name': z.string().optional(),
  'emergencyContact.phone': z.string().optional(),
  'emergencyContact.relationship': z.string().optional(),
});

const PatientFormModal = ({ isOpen, onClose, patient = null }) => {
  const queryClient = useQueryClient();
  const isEdit = !!patient;
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      email: '',
      bloodGroup: 'Unknown',
      allergies: '',
      'address.street': '',
      'address.city': '',
      'address.state': '',
      'address.zipCode': '',
      'address.country': '',
      'emergencyContact.name': '',
      'emergencyContact.phone': '',
      'emergencyContact.relationship': '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (patient) {
        reset({
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
          gender: patient.gender || '',
          phone: patient.phone || '',
          email: patient.email || '',
          bloodGroup: patient.bloodGroup || 'Unknown',
          allergies: patient.allergies || '',
          'address.street': patient.address?.street || '',
          'address.city': patient.address?.city || '',
          'address.state': patient.address?.state || '',
          'address.zipCode': patient.address?.zipCode || '',
          'address.country': patient.address?.country || '',
          'emergencyContact.name': patient.emergencyContact?.name || '',
          'emergencyContact.phone': patient.emergencyContact?.phone || '',
          'emergencyContact.relationship': patient.emergencyContact?.relationship || '',
        });
      } else {
        reset();
      }
    }
  }, [isOpen, patient, reset]);

  const createMutation = useMutation({
    mutationFn: (data) => patientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      setToast({ isVisible: true, message: 'Patient created successfully', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create patient', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => patientService.update(patient._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
      queryClient.invalidateQueries(['patient', patient._id]);
      setToast({ isVisible: true, message: 'Patient updated successfully', type: 'success' });
      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to update patient', type: 'error' });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      email: data.email || undefined,
      bloodGroup: data.bloodGroup,
      allergies: data.allergies || undefined,
      address: {
        street: data['address.street'] || undefined,
        city: data['address.city'] || undefined,
        state: data['address.state'] || undefined,
        zipCode: data['address.zipCode'] || undefined,
        country: data['address.country'] || undefined,
      },
      emergencyContact: {
        name: data['emergencyContact.name'] || undefined,
        phone: data['emergencyContact.phone'] || undefined,
        relationship: data['emergencyContact.relationship'] || undefined,
      },
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
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
              {isEdit ? 'Save Changes' : 'Create Patient'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="patient-form">
          <div className="form-section">
            <h4 className="form-section-title">Personal Information</h4>
            <div className="form-row">
              <Input
                label="First Name *"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name *"
                placeholder="Smith"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>
            <div className="form-row form-row--3">
              <Input
                label="Date of Birth *"
                type="date"
                error={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
              <Select
                label="Gender *"
                options={GENDER_OPTIONS}
                placeholder="Select gender"
                error={errors.gender?.message}
                {...register('gender')}
              />
              <Select
                label="Blood Group"
                options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                placeholder="Select blood group"
                {...register('bloodGroup')}
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Contact Information</h4>
            <div className="form-row">
              <Input
                label="Phone Number *"
                type="tel"
                placeholder="(555) 000-0000"
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Address</h4>
            <Input
              label="Street Address"
              placeholder="123 Main Street"
              {...register('address.street')}
            />
            <div className="form-row form-row--3">
              <Input
                label="City"
                placeholder="Springfield"
                {...register('address.city')}
              />
              <Input
                label="State"
                placeholder="IL"
                {...register('address.state')}
              />
              <Input
                label="ZIP Code"
                placeholder="62701"
                {...register('address.zipCode')}
              />
            </div>
            <Input
              label="Country"
              placeholder="United States"
              {...register('address.country')}
            />
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Medical Information</h4>
            <Input
              label="Allergies"
              placeholder="e.g., Penicillin, Latex"
              {...register('allergies')}
            />
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Emergency Contact</h4>
            <div className="form-row form-row--3">
              <Input
                label="Contact Name"
                placeholder="Jane Smith"
                {...register('emergencyContact.name')}
              />
              <Input
                label="Relationship"
                placeholder="Spouse"
                {...register('emergencyContact.relationship')}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="(555) 000-0000"
                {...register('emergencyContact.phone')}
              />
            </div>
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

export default PatientFormModal;