const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Patient = require('../models/Patient');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const year = new Date().getFullYear();
  return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
};

exports.getAllInvoices = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.patient) filter.patient = query.patient;
  if (query.status) filter.status = query.status;
  
  if (query.search) {
    filter.invoiceNumber = { $regex: query.search, $options: 'i' };
  }

  if (query.startDate || query.endDate) {
    filter.createdAt = {};
    if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
    if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
  }

  const sort = query.sort || '-createdAt';
  
  const invoices = await Invoice.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('patient', 'firstName lastName phone email');
  
  const total = await Invoice.countDocuments(filter);

  return {
    invoices,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getInvoiceById = async (id) => {
  const invoice = await Invoice.findById(id)
    .populate('patient', 'firstName lastName phone email address')
    .populate('appointment');
  
  if (!invoice) {
    throw new AppError('Invoice not found.', 404);
  }
  
  return invoice;
};

exports.createInvoice = async (invoiceData, userId, ipAddress) => {
  const patient = await Patient.findById(invoiceData.patient);
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  // Auto-generate invoice number if not provided
  if (!invoiceData.invoiceNumber) {
    invoiceData.invoiceNumber = await exports.generateInvoiceNumber();
  }

  // Calculate item totals
  invoiceData.items = invoiceData.items.map(item => ({
    ...item,
    total: item.quantity * item.unitPrice
  }));

  const newInvoice = await Invoice.create(invoiceData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Invoice',
    entityId: newInvoice._id,
    metadata: { invoiceNumber: newInvoice.invoiceNumber, total: newInvoice.totalAmount },
    ipAddress,
  });

  return await exports.getInvoiceById(newInvoice._id);
};

exports.updateInvoice = async (id, updateData, userId, ipAddress) => {
  const invoice = await Invoice.findById(id);
  if (!invoice) {
    throw new AppError('Invoice not found.', 404);
  }

  // Prevent updating paid invoices
  if (invoice.status === 'paid') {
    throw new AppError('Cannot update a paid invoice.', 400);
  }

  // Recalculate item totals if items are updated
  if (updateData.items) {
    updateData.items = updateData.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Invoice',
    entityId: updatedInvoice._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return await exports.getInvoiceById(updatedInvoice._id);
};

exports.deleteInvoice = async (id, userId, ipAddress) => {
  const invoice = await Invoice.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true }
  );
  
  if (!invoice) {
    throw new AppError('Invoice not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Invoice',
    entityId: invoice._id,
    metadata: { status: 'cancelled' },
    ipAddress,
  });

  return invoice;
};

exports.getInvoicePayments = async (invoiceId) => {
  const payments = await Payment.find({ invoice: invoiceId }).sort('-date');
  return payments;
};