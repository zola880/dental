const paymentService = require('../services/paymentService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllPayments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await paymentService.getAllPayments(query, page, limit);
  apiResponse(res, 200, 'Payments retrieved successfully', result.payments, result.meta);
});

exports.getPaymentById = catchAsync(async (req, res, next) => {
  const payment = await paymentService.getPaymentById(req.params.id);
  apiResponse(res, 200, 'Payment retrieved successfully', { payment });
});

exports.createPayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.createPayment(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Payment recorded successfully', { payment });
});

exports.deletePayment = catchAsync(async (req, res, next) => {
  const payment = await paymentService.deletePayment(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Payment reversed successfully', { payment });
});