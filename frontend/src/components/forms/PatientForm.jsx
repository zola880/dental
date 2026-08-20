import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Mail, MapPin, Heart } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import './PatientForm.css';

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

const PatientForm = ({ initialData = {}, onSubmit, isLoading, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      dateOfBirth: initialData.dateOfBirth 
        ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] 
        : '',
      gender: initialData.gender || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      bloodGroup: initialData.bloodGroup || 'Unknown',
      allergies: initialData.allergies || '',
      'address.street': initialData.address?.street || '',
      'address.city': initialData.address?.city || '',
      'address.state': initialData.address?.state || '',
      'address.zipCode': initialData.address?.zipCode || '',
      'address.country': initialData.address?.country || '',
      'emergencyContact.name': initialData.emergencyContact?.name || '',
      'emergencyContact.phone': initialData.emergencyContact?.phone || '',
      'emergencyContact.relationship': initialData.emergencyContact?.relationship || '',
    },
  });

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const bloodGroupOptions = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'Unknown', label: 'Unknown' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="patient-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <User size={18} />
          Personal Information
        </h4>
        <FormRow columns={2}>
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
        </FormRow>
        <FormRow columns={3}>
          <Input
            label="Date of Birth *"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />
          <Select
            label="Gender *"
            options={genderOptions}
            placeholder="Select gender"
            error={errors.gender?.message}
            {...register('gender')}
          />
          <Select
            label="Blood Group"
            options={bloodGroupOptions}
            placeholder="Select blood group"
            error={errors.bloodGroup?.message}
            {...register('bloodGroup')}
          />
        </FormRow>
        <FormRow columns={2}>
          <Input
            label="Phone Number *"
            type="tel"
            icon={Phone}
            placeholder="(555) 000-0000"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="patient@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </FormRow>
        <Input
          label="Allergies / Medical Conditions"
          icon={Heart}
          placeholder="e.g., Penicillin allergy, Asthma, etc."
          error={errors.allergies?.message}
          {...register('allergies')}
        />
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <MapPin size={18} />
          Address
        </h4>
        <Input
          label="Street Address"
          placeholder="123 Main Street"
          error={errors['address.street']?.message}
          {...register('address.street')}
        />
        <FormRow columns={3}>
          <Input
            label="City"
            placeholder="Springfield"
            error={errors['address.city']?.message}
            {...register('address.city')}
          />
          <Input
            label="State / Province"
            placeholder="IL"
            error={errors['address.state']?.message}
            {...register('address.state')}
          />
          <Input
            label="ZIP Code"
            placeholder="62701"
            error={errors['address.zipCode']?.message}
            {...register('address.zipCode')}
          />
        </FormRow>
        <Input
          label="Country"
          placeholder="USA"
          error={errors['address.country']?.message}
          {...register('address.country')}
        />
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <Phone size={18} />
          Emergency Contact
        </h4>
        <FormRow columns={2}>
          <Input
            label="Contact Name"
            placeholder="Jane Smith"
            error={errors['emergencyContact.name']?.message}
            {...register('emergencyContact.name')}
          />
          <Input
            label="Contact Phone"
            type="tel"
            placeholder="(555) 000-0000"
            error={errors['emergencyContact.phone']?.message}
            {...register('emergencyContact.phone')}
          />
        </FormRow>
        <Input
          label="Relationship"
          placeholder="e.g., Spouse, Parent, Sibling"
          error={errors['emergencyContact.relationship']?.message}
          {...register('emergencyContact.relationship')}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Patient' : 'Create Patient'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;