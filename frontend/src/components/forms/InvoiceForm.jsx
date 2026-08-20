import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Receipt, Plus, User, Calendar, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import InvoiceItemRow from './InvoiceItemRow';
import './InvoiceForm.css';

const invoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  patient: z.string().min(1, 'Patient is required'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.coerce.number().min(0, 'Price must be positive'),
  })).min(1, 'At least one item is required'),
  discount: z.coerce.number().min(0).optional(),
  tax: z.coerce.number().min(0).optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

const InvoiceForm = ({ 
  initialData = {}, 
  patients = [],
  onSubmit, 
  isLoading, 
  onCancel 
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: initialData.invoiceNumber || '',
      patient: initialData.patient?._id || initialData.patient || '',
      items: initialData.items?.length > 0 
        ? initialData.items 
        : [{ description: '', quantity: 1, unitPrice: 0 }],
      discount: initialData.discount || 0,
      tax: initialData.tax || 0,
      dueDate: initialData.dueDate 
        ? new Date(initialData.dueDate).toISOString().split('T')[0] 
        : '',
      notes: initialData.notes || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items') || [];
  const discount = watch('discount') || 0;
  const tax = watch('tax') || 0;

  const subtotal = items.reduce((sum, item) => {
    return sum + ((item.quantity || 0) * (item.unitPrice || 0));
  }, 0);

  const total = subtotal - (discount || 0) + (tax || 0);

  const patientOptions = patients.map(p => ({
    value: p._id,
    label: `${p.firstName} ${p.lastName}`,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="invoice-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <Receipt size={18} />
          Invoice Information
        </h4>
        <FormRow columns={2}>
          <Input
            label="Invoice Number"
            placeholder="Auto-generated if empty"
            error={errors.invoiceNumber?.message}
            {...register('invoiceNumber')}
          />
          <Select
            label="Patient *"
            options={patientOptions}
            placeholder="Select patient"
            error={errors.patient?.message}
            {...register('patient')}
          />
        </FormRow>
        <Input
          label="Due Date"
          type="date"
          icon={Calendar}
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <FileText size={18} />
          Line Items
        </h4>
        <div className="invoice-items">
          <div className="invoice-items__header">
            <span className="invoice-items__header-label">Description</span>
            <span className="invoice-items__header-label">Qty</span>
            <span className="invoice-items__header-label">Unit Price</span>
            <span className="invoice-items__header-label">Total</span>
          </div>
          {fields.map((field, index) => (
            <InvoiceItemRow
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              watch={watch}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            className="invoice-items__add"
          >
            <Plus size={14} />
            Add Item
          </Button>
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <Receipt size={18} />
          Totals
        </h4>
        <div className="invoice-totals">
          <FormRow columns={2}>
            <Input
              label="Discount ($)"
              type="number"
              min="0"
              step="0.01"
              error={errors.discount?.message}
              {...register('discount')}
            />
            <Input
              label="Tax ($)"
              type="number"
              min="0"
              step="0.01"
              error={errors.tax?.message}
              {...register('tax')}
            />
          </FormRow>
          <div className="invoice-totals__summary">
            <div className="invoice-totals__row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="invoice-totals__row">
              <span>Discount</span>
              <span>-${(discount || 0).toFixed(2)}</span>
            </div>
            <div className="invoice-totals__row">
              <span>Tax</span>
              <span>+${(tax || 0).toFixed(2)}</span>
            </div>
            <div className="invoice-totals__row invoice-totals__row--total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <FileText size={18} />
          Notes
        </h4>
        <div className="input-group">
          <textarea
            className="input__field invoice-notes-textarea"
            placeholder="Additional notes for the invoice..."
            rows={3}
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
          {initialData._id ? 'Update Invoice' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;