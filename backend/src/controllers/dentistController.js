const dentistService = require('../services/dentistService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllDentists = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await dentistService.getAllDentists(query, page, limit);
  apiResponse(res, 200, 'Dentists retrieved successfully', result.dentists, result.meta);
});

exports.getDentistById = catchAsync(async (req, res, next) => {
  const dentist = await dentistService.getDentistById(req.params.id);
  apiResponse(res, 200, 'Dentist retrieved successfully', { dentist });
});

exports.createDentist = catchAsync(async (req, res, next) => {
  const dentist = await dentistService.createDentist(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Dentist created successfully', { dentist });
});

exports.updateDentist = catchAsync(async (req, res, next) => {
  const dentist = await dentistService.updateDentist(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Dentist updated successfully', { dentist });
});

exports.deleteDentist = catchAsync(async (req, res, next) => {
  const dentist = await dentistService.deleteDentist(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Dentist removed successfully', { dentist });
});

exports.getDentistStats = catchAsync(async (req, res, next) => {
  const stats = await dentistService.getDentistStats(req.params.id);
  apiResponse(res, 200, 'Dentist statistics retrieved successfully', stats);
});

exports.getDentistSchedule = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return next(new AppError('Start date and end date are required.', 400));
  }
  const schedule = await dentistService.getDentistSchedule(req.params.id, startDate, endDate);
  apiResponse(res, 200, 'Dentist schedule retrieved successfully', { schedule });
});