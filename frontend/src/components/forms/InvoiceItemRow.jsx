import React from 'react';
import { Trash2, Calculator } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './InvoiceItemRow.css';

const InvoiceItemRow = ({ 
  index, 
  register, 
  errors, 
  watch, 
  onRemove, 
  canRemove = true 
}) => {
  const quantity = watch(`items.${index}.quantity`) || 0;
  const unitPrice = watch(`items.${index}.unitPrice`) || 0;
  const total = quantity * unitPrice;

  return (
    <div className="invoice-item-row">
      <div className="invoice-item-row__number">#{index + 1}</div>
      <div className="invoice-item-row__fields">
        <div className="invoice-item-row__field invoice-item-row__field--description">
          <Input
            placeholder="Description"
            error={errors?.items?.[index]?.description?.message}
            {...register(`items.${index}.description`)}
          />
        </div>
        <div className="invoice-item-row__field invoice-item-row__field--quantity">
          <Input
            type="number"
            placeholder="Qty"
            min="1"
            error={errors?.items?.[index]?.quantity?.message}
            {...register(`items.${index}.quantity`)}
          />
        </div>
        <div className="invoice-item-row__field invoice-item-row__field--price">
          <Input
            type="number"
            placeholder="Unit Price"
            min="0"
            step="0.01"
            error={errors?.items?.[index]?.unitPrice?.message}
            {...register(`items.${index}.unitPrice`)}
          />
        </div>
        <div className="invoice-item-row__field invoice-item-row__field--total">
          <div className="invoice-item-row__total-display">
            <Calculator size={14} />
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {canRemove && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onRemove}
          className="invoice-item-row__remove"
          title="Remove item"
        >
          <Trash2 size={14} />
        </Button>
      )}
    </div>
  );
};

export default InvoiceItemRow;