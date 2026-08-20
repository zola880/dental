import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, Phone, Mail, Stethoscope, CheckCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Toast from '../../components/ui/Toast';
import './AppointmentBooking.css';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  service: z.string().min(1, 'Please select a service'),
  dentist: z.string().min(1, 'Please select a dentist'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  notes: z.string().optional(),
});

const AppointmentBooking = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      service: '',
      dentist: '',
      date: '',
      time: '',
      notes: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setToast({ isVisible: true, message: 'Appointment request submitted successfully!', type: 'success' });
    }, 2000);
  };

  const serviceOptions = [
    { value: 'dental-cleaning', label: 'Dental Cleaning' },
    { value: 'teeth-whitening', label: 'Teeth Whitening' },
    { value: 'dental-checkup', label: 'Dental Checkup' },
    { value: 'root-canal', label: 'Root Canal Treatment' },
    { value: 'dental-filling', label: 'Dental Filling' },
    { value: 'tooth-extraction', label: 'Tooth Extraction' },
    { value: 'dental-implant', label: 'Dental Implant' },
    { value: 'orthodontics', label: 'Orthodontic Consultation' },
    { value: 'pediatric', label: 'Pediatric Dental Visit' },
    { value: 'emergency', label: 'Emergency Dental Care' },
  ];

  const dentistOptions = [
    { value: 'dr-johnson', label: 'Dr. Sarah Johnson - General Dentistry' },
    { value: 'dr-torres', label: 'Dr. Michael Torres - Orthodontics' },
    { value: 'dr-park', label: 'Dr. Lisa Park - Pediatric Dentistry' },
    { value: 'dr-hassan', label: 'Dr. Ahmed Hassan - Oral Surgery' },
  ];

  const timeSlots = [
    { value: '09:00', label: '9:00 AM' },
    { value: '09:30', label: '9:30 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '10:30', label: '10:30 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '11:30', label: '11:30 AM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '13:30', label: '1:30 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '14:30', label: '2:30 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '15:30', label: '3:30 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '16:30', label: '4:30 PM' },
  ];

  if (isSubmitted) {
    return (
      <div className="booking-page">
        <div className="section-container">
          <div className="booking-success">
            <div className="booking-success__icon">
              <CheckCircle size={64} />
            </div>
            <h1 className="booking-success__title">Appointment Requested!</h1>
            <p className="booking-success__description">
              Thank you for your booking request. Our team will confirm your 
              appointment via email or phone within 24 hours.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setIsSubmitted(false);
                reset();
              }}
            >
              Book Another Appointment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <div className="section-container">
          <span className="section-tag">Schedule a Visit</span>
          <h1 className="booking-hero__title">Book an Appointment</h1>
          <p className="booking-hero__description">
            Fill out the form below and our team will confirm your appointment. 
            New patients are always welcome.
          </p>
        </div>
      </section>

      <section className="booking-form-section">
        <div className="section-container">
          <div className="booking-form-wrapper">
            <form onSubmit={handleSubmit(onSubmit)} className="booking-form">
              <div className="booking-form__section">
                <h3 className="booking-form__section-title">
                  <User size={18} />
                  Personal Information
                </h3>
                <div className="booking-form__row">
                  <Input
                    label="First Name"
                    placeholder="John"
                    error={errors.firstName?.message}
                    {...register('firstName')}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Smith"
                    error={errors.lastName?.message}
                    {...register('lastName')}
                  />
                </div>
                <div className="booking-form__row">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="(555) 000-0000"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                </div>
              </div>

              <div className="booking-form__section">
                <h3 className="booking-form__section-title">
                  <Stethoscope size={18} />
                  Appointment Details
                </h3>
                <div className="booking-form__row">
                  <Select
                    label="Service"
                    options={serviceOptions}
                    placeholder="Select a service"
                    error={errors.service?.message}
                    {...register('service')}
                  />
                  <Select
                    label="Preferred Dentist"
                    options={dentistOptions}
                    placeholder="Select a dentist"
                    error={errors.dentist?.message}
                    {...register('dentist')}
                  />
                </div>
                <div className="booking-form__row">
                  <Input
                    label="Preferred Date"
                    type="date"
                    error={errors.date?.message}
                    {...register('date')}
                  />
                  <Select
                    label="Preferred Time"
                    options={timeSlots}
                    placeholder="Select a time slot"
                    error={errors.time?.message}
                    {...register('time')}
                  />
                </div>
              </div>

              <div className="booking-form__section">
                <h3 className="booking-form__section-title">
                  <Mail size={18} />
                  Additional Notes
                </h3>
                <div className="input-group">
                  <label className="input__label">Notes (Optional)</label>
                  <textarea
                    className="input__field booking-textarea"
                    placeholder="Any specific concerns or requests..."
                    rows={4}
                    {...register('notes')}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="booking-form__submit"
              >
                <Calendar size={18} />
                Request Appointment
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default AppointmentBooking;