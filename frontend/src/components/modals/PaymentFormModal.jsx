import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../../services/paymentService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Toast from '../ui/Toast';
import { formatCurrency } from '../../utils/formatCurrency';
import { PAYMENT_METHODS } from '../../utils/constants';
import './PaymentFormModal.css';

const paymentSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

const PaymentFormModal = ({ isOpen, onClose, invoice = null }) => {
  const queryClient = useQueryClient();
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'cash',
      transactionId: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      const outstanding = invoice ? (invoice.totalAmount - invoice.paidAmount) : 0;
      reset({
        amount: outstanding > 0 ? outstanding : 0,
        paymentMethod: 'cash',
        transactionId: '',
        notes: '',
      });
    }
  }, [isOpen, invoice, reset]);

  const createMutation = useMutation({
    mutationFn: (data) => paymentService.create({ ...data, invoice: invoice._id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['payments']);
      queryClient.invalidateQueries(['invoices']);
      queryClient.invalidateQueries(['invoice-payments', invoice._id]);
      setToast({ isVisible: true, message: 'Payment recorded successfully', type: 'success' });
      setTimeout(() => onClose(), 1000);
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to record payment', type: 'error' });
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate({
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId || undefined,
      notes: data.notes || undefined,
    });
  };

  const outstanding = invoice ? (invoice.totalAmount - invoice.paidAmount) : 0;
  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Record Payment"
        size="sm"
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
              Record Payment
            </Button>
          </>
        }
      >
        {invoice && (
          <div className="payment-invoice-summary">
            <div className="payment-summary-row">
              <span>Invoice</span>
              <strong>{invoice.invoiceNumber}</strong>
            </div>
            <div className="payment-summary-row">
              <span>Total Amount</span>
              <strong>{formatCurrency(invoice.totalAmount)}</strong>
            </div>
            <div className="payment-summary-row">
              <span>Already Paid</span>
              <strong>{formatCurrency(invoice.paidAmount)}</strong>
            </div>
            <div className="payment-summary-row payment-summary-row--outstanding">
              <span>Outstanding</span>
              <strong>{formatCurrency(outstanding)}</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
          <Input
            label="Payment Amount *"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <Select
            label="Payment Method *"
            options={paymentMethodOptions}
            placeholder="Select method"
            error={errors.paymentMethod?.message}
            {...register('paymentMethod')}
          />
          <Input
            label="Transaction ID"
            placeholder="Optional reference number"
            {...register('transactionId')}
          />
          <div className="input-group">
            <label className="input__label">Notes</label>
            <textarea
              className="input__field payment-textarea"
              placeholder="Optional notes..."
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

export default PaymentFormModal;