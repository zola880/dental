import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, DollarSign, FileText } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import './PaymentForm.css';

const paymentSchema = z.object({
  amount: z.coerce.number()
    .min(0.01, 'Amount must be greater than 0')
    .refine(
      (val) => val <= (window.maxPaymentAmount || Infinity),
      { message: 'Amount exceeds outstanding balance' }
    ),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

const PaymentForm = ({ 
  outstandingBalance = 0,
  invoiceNumber = '',
  onSubmit, 
  isLoading, 
  onCancel 
}) => {
  // Set max payment amount for validation
  React.useEffect(() => {
    window.maxPaymentAmount = outstandingBalance;
    return () => { delete window.maxPaymentAmount; };
  }, [outstandingBalance]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: outstandingBalance || 0,
      paymentMethod: 'cash',
      transactionId: '',
      notes: '',
    },
  });

  const paymentMethodOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
      <div className="payment-form__info">
        <div className="payment-form__info-item">
          <span className="payment-form__info-label">Invoice</span>
          <span className="payment-form__info-value">{invoiceNumber}</span>
        </div>
        <div className="payment-form__info-item">
          <span className="payment-form__info-label">Outstanding Balance</span>
          <span className="payment-form__info-value payment-form__info-value--highlight">
            ${outstandingBalance.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <CreditCard size={18} />
          Payment Details
        </h4>
        <Input
          label="Amount *"
          type="number"
          icon={DollarSign}
          placeholder="0.00"
          step="0.01"
          min="0.01"
          max={outstandingBalance}
          error={errors.amount?.message}
          {...register('amount')}
        />
        <Select
          label="Payment Method *"
          options={paymentMethodOptions}
          placeholder="Select payment method"
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        />
        <Input
          label="Transaction ID / Reference"
          placeholder="Optional reference number"
          error={errors.transactionId?.message}
          {...register('transactionId')}
        />
      </div>

      <div className="form-section">
        <h4 className="form-section__title">
          <FileText size={18} />
          Notes
        </h4>
        <div className="input-group">
          <textarea
            className="input__field payment-notes-textarea"
            placeholder="Additional notes about this payment..."
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
          Record Payment
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;