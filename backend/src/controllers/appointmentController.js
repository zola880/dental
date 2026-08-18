const appointmentService = require('../services/appointmentService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllAppointments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await appointmentService.getAllAppointments(query, page, limit);
  apiResponse(res, 200, 'Appointments retrieved successfully', result.appointments, result.meta);
});

exports.getAppointmentById = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.getAppointmentById(req.params.id);
  apiResponse(res, 200, 'Appointment retrieved successfully', { appointment });
});

exports.createAppointment = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.createAppointment(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Appointment created successfully', { appointment });
});

exports.updateAppointment = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.updateAppointment(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Appointment updated successfully', { appointment });
});

exports.deleteAppointment = catchAsync(async (req, res, next) => {
  const appointment = await appointmentService.deleteAppointment(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Appointment cancelled successfully', { appointment });
});

exports.getAppointmentsByDateRange = catchAsync(async (req, res, next) => {
  const { startDate, endDate, dentistId } = req.query;
  
  if (!startDate || !endDate) {
    return next(new AppError('Start date and end date are required.', 400));
  }

  const appointments = await appointmentService.getAppointmentsByDateRange(startDate, endDate, dentistId);
  apiResponse(res, 200, 'Appointments retrieved successfully', { appointments });
});