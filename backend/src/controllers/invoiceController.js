const invoiceService = require('../services/invoiceService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllInvoices = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await invoiceService.getAllInvoices(query, page, limit);
  apiResponse(res, 200, 'Invoices retrieved successfully', result.invoices, result.meta);
});

exports.getInvoiceById = catchAsync(async (req, res, next) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  apiResponse(res, 200, 'Invoice retrieved successfully', { invoice });
});

exports.createInvoice = catchAsync(async (req, res, next) => {
  const invoice = await invoiceService.createInvoice(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Invoice created successfully', { invoice });
});

exports.updateInvoice = catchAsync(async (req, res, next) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Invoice updated successfully', { invoice });
});

exports.deleteInvoice = catchAsync(async (req, res, next) => {
  const invoice = await invoiceService.deleteInvoice(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Invoice cancelled successfully', { invoice });
});

exports.getInvoicePayments = catchAsync(async (req, res, next) => {
  const payments = await invoiceService.getInvoicePayments(req.params.id);
  apiResponse(res, 200, 'Invoice payments retrieved successfully', { payments });
});