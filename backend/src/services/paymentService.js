const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllPayments = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.invoice) filter.invoice = query.invoice;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
  
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  const sort = query.sort || '-date';
  
  const payments = await Payment.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'invoice',
      populate: { path: 'patient', select: 'firstName lastName phone' }
    });
  
  const total = await Payment.countDocuments(filter);

  return {
    payments,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getPaymentById = async (id) => {
  const payment = await Payment.findById(id)
    .populate({
      path: 'invoice',
      populate: { path: 'patient', select: 'firstName lastName phone email' }
    });
  
  if (!payment) {
    throw new AppError('Payment not found.', 404);
  }
  
  return payment;
};

exports.createPayment = async (paymentData, userId, ipAddress) => {
  const invoice = await Invoice.findById(paymentData.invoice);
  if (!invoice) {
    throw new AppError('Invoice not found.', 404);
  }

  if (invoice.status === 'cancelled') {
    throw new AppError('Cannot make payment for a cancelled invoice.', 400);
  }

  // Check if payment amount exceeds outstanding balance
  const outstandingBalance = invoice.totalAmount - invoice.paidAmount;
  if (paymentData.amount > outstandingBalance) {
    throw new AppError(`Payment amount exceeds outstanding balance of ${outstandingBalance}.`, 400);
  }

  const newPayment = await Payment.create(paymentData);

  // Update invoice paid amount
  invoice.paidAmount += paymentData.amount;
  await invoice.save();
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Payment',
    entityId: newPayment._id,
    metadata: { 
      invoiceId: invoice._id, 
      amount: paymentData.amount,
      method: paymentData.paymentMethod 
    },
    ipAddress,
  });

  return await exports.getPaymentById(newPayment._id);
};

exports.deletePayment = async (id, userId, ipAddress) => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new AppError('Payment not found.', 404);
  }

  // Reverse the payment from invoice
  const invoice = await Invoice.findById(payment.invoice);
  if (invoice) {
    invoice.paidAmount -= payment.amount;
    await invoice.save();
  }

  await Payment.findByIdAndDelete(id);
  
  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Payment',
    entityId: payment._id,
    metadata: { reversed: true, amount: payment.amount },
    ipAddress,
  });

  return payment;
};