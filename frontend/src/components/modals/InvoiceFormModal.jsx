import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../../services/invoiceService';
import { patientService } from '../../services/patientService';
import { serviceService } from '../../services/serviceService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import './InvoiceFormModal.css';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description required'),
  quantity: z.coerce.number().min(1, 'Min 1'),
  unitPrice: z.coerce.number().min(0, 'Must be positive'),
});

const invoiceSchema = z.object({
  patient: z.string().min(1, 'Patient is required'),
  dueDate: z.string().optional(),
  discount: z.coerce.number().min(0).optional(),
  tax: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item required'),
});

const InvoiceFormModal = ({ isOpen, onClose, preselectedPatient = null }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      patient: preselectedPatient || '',
      dueDate: '',
      discount: 0,
      tax: 0,
      notes: '',
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items');
  const watchedDiscount = watch('discount') || 0;
  const watchedTax = watch('tax') || 0;

  const subtotal = watchedItems.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  }, 0);

  const total = subtotal - (Number(watchedDiscount) || 0) + (Number(watchedTax) || 0);

  const { data: patientsData } = useQuery({
    queryKey: ['patients-dropdown'],
    queryFn: () => patientService.getAll({ limit: 1000 }),
    enabled: isOpen,
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services-dropdown'],
    queryFn: () => serviceService.getAll({ limit: 100 }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        patient: preselectedPatient || '',
        dueDate: '',
        discount: 0,
        tax: 0,
        notes: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
      });
    }
  }, [isOpen, preselectedPatient, reset]);

  const createMutation = useMutation({
    mutationFn: (data) => invoiceService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      setToast({ isVisible: true, message: 'Invoice created successfully', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to create invoice', type: 'error' });
    },
  });

  const onSubmit = (data) => {
    const payload = {
      patient: data.patient,
      dueDate: data.dueDate || undefined,
      discount: Number(data.discount) || 0,
      tax: Number(data.tax) || 0,
      notes: data.notes || undefined,
      items: data.items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        total: Number(item.quantity) * Number(item.unitPrice),
      })),
    };
    createMutation.mutate(payload);
  };

  const handleAddService = (serviceId) => {
    const service = servicesData?.data?.find(s => s._id === serviceId);
    if (service) {
      append({
        description: service.name,
        quantity: 1,
        unitPrice: service.price,
      });
    }
  };

  const patientOptions = patientsData?.data?.map(p => ({
    value: p._id,
    label: `${p.firstName} ${p.lastName}`
  })) || [];

  const serviceOptions = servicesData?.data?.map(s => ({
    value: s._id,
    label: `${s.name} - ${formatCurrency(s.price)}`
  })) || [];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Create Invoice"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={onClose} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              isLoading={createMutation.isPending}
            >
              Create Invoice
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="invoice-form">
          <div className="form-row">
            <Select
              label="Patient *"
              options={patientOptions}
              placeholder="Select patient"
              error={errors.patient?.message}
              {...register('patient')}
            />
            <Input
              label="Due Date"
              type="date"
              {...register('dueDate')}
            />
          </div>

          <div className="invoice-items-section">
            <div className="invoice-items-header">
              <h4>Invoice Items</h4>
              <Select
                options={[{ value: '', label: '+ Add from Services' }, ...serviceOptions]}
                placeholder="+ Add from Services"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddService(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="invoice-service-select"
              />
            </div>

            <div className="invoice-items-list">
              <div className="invoice-items-list-header">
                <span className="col-desc">Description</span>
                <span className="col-qty">Qty</span>
                <span className="col-price">Unit Price</span>
                <span className="col-total">Total</span>
                <span className="col-action"></span>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="invoice-item-row">
                  <div className="col-desc">
                    <input
                      className="invoice-item-input"
                      placeholder="Service description"
                      {...register(`items.${index}.description`)}
                    />
                    {errors.items?.[index]?.description && (
                      <span className="input__error">{errors.items[index].description.message}</span>
                    )}
                  </div>
                  <div className="col-qty">
                    <input
                      type="number"
                      className="invoice-item-input"
                      min="1"
                      {...register(`items.${index}.quantity`)}
                    />
                  </div>
                  <div className="col-price">
                    <input
                      type="number"
                      step="0.01"
                      className="invoice-item-input"
                      {...register(`items.${index}.unitPrice`)}
                    />
                  </div>
                  <div className="col-total">
                    <span className="invoice-item-total">
                      {formatCurrency((Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.unitPrice) || 0))}
                    </span>
                  </div>
                  <div className="col-action">
                    <button
                      type="button"
                      className="invoice-item-remove"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="invoice-add-item-btn"
                onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
              >
                <Plus size={16} />
                Add Custom Item
              </button>
            </div>
          </div>

          <div className="invoice-summary">
            <div className="form-row">
              <Input
                label="Discount ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('discount')}
              />
              <Input
                label="Tax ($)"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('tax')}
              />
            </div>

            <div className="invoice-totals">
              <div className="invoice-totals-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="invoice-totals-row">
                <span>Discount</span>
                <span>-{formatCurrency(Number(watchedDiscount) || 0)}</span>
              </div>
              <div className="invoice-totals-row">
                <span>Tax</span>
                <span>+{formatCurrency(Number(watchedTax) || 0)}</span>
              </div>
              <div className="invoice-totals-row invoice-totals-row--total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="input-group">
            <label className="input__label">Notes</label>
            <textarea
              className="input__field invoice-textarea"
              placeholder="Payment terms, special notes..."
              rows={2}
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

export default InvoiceFormModal;