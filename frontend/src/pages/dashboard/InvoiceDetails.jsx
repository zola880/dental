import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '../../services/invoiceService';
import { paymentService } from '../../services/paymentService';
import { 
  ArrowLeft, 
  Receipt, 
  User, 
  Calendar, 
  DollarSign,
  CreditCard,
  FileText,
  Plus,
  Download
} from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import { INVOICE_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate, formatDateTime } from '../../utils/formatDate';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Table from '../../components/ui/Table';
import PaymentForm from '../../components/forms/PaymentForm';
import './InvoiceDetails.css';

const getStatusVariant = (status) => {
  const map = {
    draft: 'default',
    pending: 'warning',
    partially_paid: 'info',
    paid: 'success',
    cancelled: 'danger',
  };
  return map[status] || 'default';
};

const getPaymentMethodLabel = (method) => {
  const labels = {
    cash: 'Cash',
    card: 'Credit/Debit Card',
    bank_transfer: 'Bank Transfer',
    insurance: 'Insurance',
    other: 'Other',
  };
  return labels[method] || method;
};

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const paymentModal = useModal();
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' });

  const { data: invoiceData, isLoading: invoiceLoading } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => invoiceService.getById(invoiceId),
  });

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['invoice-payments', invoiceId],
    queryFn: () => invoiceService.getPayments(invoiceId),
  });

  const invoice = invoiceData?.data?.invoice;
  const payments = paymentsData?.data?.payments || [];
  const outstandingBalance = invoice ? invoice.totalAmount - invoice.paidAmount : 0;

  const paymentMutation = useMutation({
    mutationFn: (data) => paymentService.create({
      ...data,
      invoice: invoiceId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoice', invoiceId]);
      queryClient.invalidateQueries(['invoice-payments', invoiceId]);
      queryClient.invalidateQueries(['invoices']);
      paymentModal.close();
      setToast({ isVisible: true, message: 'Payment recorded successfully', type: 'success' });
    },
    onError: (error) => {
      setToast({ isVisible: true, message: error.message || 'Failed to record payment', type: 'error' });
    },
  });

  const handleRecordPayment = (formData) => {
    paymentMutation.mutate(formData);
  };

  const paymentColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (row) => formatDateTime(row.date),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => (
        <span className="payment-amount">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: 'Method',
      render: (row) => (
        <div className="payment-method">
          <CreditCard size={14} />
          <span>{getPaymentMethodLabel(row.paymentMethod)}</span>
        </div>
      ),
    },
    {
      key: 'transactionId',
      header: 'Reference',
      render: (row) => row.transactionId || '-',
    },
    {
      key: 'notes',
      header: 'Notes',
      render: (row) => row.notes || '-',
    },
  ];

  if (invoiceLoading) {
    return (
      <div className="invoice-details-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="invoice-details-error">
        <p>Invoice not found</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard/billing')}>
          Back to Billing
        </Button>
      </div>
    );
  }

  return (
    <div className="invoice-details-page">
      <div className="invoice-details-header">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/dashboard/billing')}
        >
          <ArrowLeft size={16} />
          Back to Billing
        </Button>
        {outstandingBalance > 0 && invoice.status !== 'cancelled' && (
          <Button variant="primary" onClick={() => paymentModal.open()}>
            <Plus size={18} />
            Record Payment
          </Button>
        )}
      </div>

      {/* Invoice Header Card */}
      <Card padding="lg" className="invoice-header-card">
        <div className="invoice-header-card__top">
          <div className="invoice-header-card__info">
            <div className="invoice-header-card__icon">
              <Receipt size={28} />
            </div>
            <div>
              <h1 className="invoice-header-card__number">{invoice.invoiceNumber}</h1>
              <div className="invoice-header-card__meta">
                <span className="invoice-header-card__meta-item">
                  <User size={14} />
                  {invoice.patient?.firstName} {invoice.patient?.lastName}
                </span>
                <span className="invoice-header-card__meta-item">
                  <Calendar size={14} />
                  Created {formatDate(invoice.createdAt)}
                </span>
                {invoice.dueDate && (
                  <span className="invoice-header-card__meta-item">
                    <Calendar size={14} />
                    Due {formatDate(invoice.dueDate)}
                  </span>
                )}
                <Badge variant={getStatusVariant(invoice.status)}>
                  {INVOICE_STATUS_LABELS[invoice.status]}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            <Download size={16} />
            Download PDF
          </Button>
        </div>

        <div className="invoice-header-card__totals">
          <div className="invoice-header-card__total-item">
            <span className="invoice-header-card__total-label">Subtotal</span>
            <span className="invoice-header-card__total-value">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>
          {invoice.discount > 0 && (
            <div className="invoice-header-card__total-item">
              <span className="invoice-header-card__total-label">Discount</span>
              <span className="invoice-header-card__total-value">
                -{formatCurrency(invoice.discount)}
              </span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="invoice-header-card__total-item">
              <span className="invoice-header-card__total-label">Tax</span>
              <span className="invoice-header-card__total-value">
                +{formatCurrency(invoice.tax)}
              </span>
            </div>
          )}
          <div className="invoice-header-card__total-item invoice-header-card__total-item--main">
            <span className="invoice-header-card__total-label">Total Amount</span>
            <span className="invoice-header-card__total-value">
              {formatCurrency(invoice.totalAmount)}
            </span>
          </div>
          <div className="invoice-header-card__total-item invoice-header-card__total-item--paid">
            <span className="invoice-header-card__total-label">Paid</span>
            <span className="invoice-header-card__total-value">
              {formatCurrency(invoice.paidAmount)}
            </span>
          </div>
          <div className="invoice-header-card__total-item invoice-header-card__total-item--outstanding">
            <span className="invoice-header-card__total-label">Outstanding</span>
            <span className="invoice-header-card__total-value">
              {formatCurrency(outstandingBalance)}
            </span>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card padding="lg" className="invoice-items-card">
        <h2 className="invoice-section__title">
          <FileText size={20} />
          Line Items
        </h2>
        <div className="invoice-items-table">
          <div className="invoice-items-table__header">
            <span className="invoice-items-table__header-item">#</span>
            <span className="invoice-items-table__header-item invoice-items-table__header-item--desc">Description</span>
            <span className="invoice-items-table__header-item">Qty</span>
            <span className="invoice-items-table__header-item">Unit Price</span>
            <span className="invoice-items-table__header-item">Total</span>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={idx} className="invoice-items-table__row">
              <span className="invoice-items-table__cell">{idx + 1}</span>
              <span className="invoice-items-table__cell invoice-items-table__cell--desc">
                {item.description}
              </span>
              <span className="invoice-items-table__cell">{item.quantity}</span>
              <span className="invoice-items-table__cell">
                {formatCurrency(item.unitPrice)}
              </span>
              <span className="invoice-items-table__cell invoice-items-table__cell--total">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment History */}
      <Card padding="lg" className="invoice-payments-card">
        <h2 className="invoice-section__title">
          <CreditCard size={20} />
          Payment History ({payments.length})
        </h2>
        {paymentsLoading ? (
          <div className="payments-loading">
            <LoadingSpinner />
          </div>
        ) : payments.length === 0 ? (
          <div className="payments-empty">
            <CreditCard size={40} />
            <h3>No payments recorded yet</h3>
            <p>Record a payment to start tracking this invoice's progress.</p>
            {outstandingBalance > 0 && invoice.status !== 'cancelled' && (
              <Button variant="primary" onClick={() => paymentModal.open()}>
                <Plus size={18} />
                Record First Payment
              </Button>
            )}
          </div>
        ) : (
          <Table columns={paymentColumns} data={payments} />
        )}
      </Card>

      {/* Notes */}
      {invoice.notes && (
        <Card padding="lg" className="invoice-notes-card">
          <h2 className="invoice-section__title">
            <FileText size={20} />
            Notes
          </h2>
          <p className="invoice-notes-text">{invoice.notes}</p>
        </Card>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModal.isOpen}
        onClose={paymentModal.close}
        title="Record Payment"
        size="md"
      >
        <PaymentForm
          invoiceNumber={invoice.invoiceNumber}
          outstandingBalance={outstandingBalance}
          onSubmit={handleRecordPayment}
          isLoading={paymentMutation.isPending}
          onCancel={paymentModal.close}
        />
      </Modal>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default InvoiceDetails;