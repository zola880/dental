import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Receipt, Calendar, DollarSign, Tag } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import FormRow from './FormRow';
import Button from '../ui/Button';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import './ExpenseForm.css';

const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
});

const ExpenseForm = ({ 
  initialData = {}, 
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
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: initialData.category || '',
      description: initialData.description || '',
      amount: initialData.amount?.toString() || '',
      date: formatDateLocal(initialData.date),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="expense-form">
      <div className="form-section">
        <h4 className="form-section__title">
          <Receipt size={18} />
          Expense Details
        </h4>
        <FormRow columns={2}>
          <Select
            label="Category *"
            options={EXPENSE_CATEGORIES}
            placeholder="Select category"
            error={errors.category?.message}
            {...register('category')}
          />
          <Input
            label="Amount *"
            type="number"
            icon={DollarSign}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </FormRow>
        <Input
          label="Description *"
          icon={Tag}
          placeholder="e.g., Office supplies, Monthly rent, Electricity bill"
          error={errors.description?.message}
          {...register('description')}
        />
        <Input
          label="Date *"
          type="date"
          icon={Calendar}
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData._id ? 'Update Expense' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;