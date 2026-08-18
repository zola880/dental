const reportService = require('../services/reportService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getFinancialSummary = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return next(new Error('Start date and end date are required.'));
  }

  const summary = await reportService.getFinancialSummary(startDate, endDate);
  apiResponse(res, 200, 'Financial summary retrieved successfully', summary);
});

exports.getRevenueByService = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return next(new Error('Start date and end date are required.'));
  }

  const revenue = await reportService.getRevenueByService(startDate, endDate);
  apiResponse(res, 200, 'Revenue by service retrieved successfully', { revenue });
});

exports.getRevenueByPeriod = catchAsync(async (req, res, next) => {
  const { period = 'monthly' } = req.query;
  const revenue = await reportService.getRevenueByPeriod(period);
  apiResponse(res, 200, 'Revenue by period retrieved successfully', { revenue });
});

exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await reportService.getDashboardStats();
  apiResponse(res, 200, 'Dashboard statistics retrieved successfully', stats);
});