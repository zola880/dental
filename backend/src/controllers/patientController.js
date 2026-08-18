const patientService = require('../services/patientService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllPatients = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await patientService.getAllPatients(query, page, limit);
  apiResponse(res, 200, 'Patients retrieved successfully', result.patients, result.meta);
});

exports.getPatientById = catchAsync(async (req, res, next) => {
  const patient = await patientService.getPatientById(req.params.id);
  apiResponse(res, 200, 'Patient retrieved successfully', { patient });
});

exports.createPatient = catchAsync(async (req, res, next) => {
  const patient = await patientService.createPatient(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Patient created successfully', { patient });
});

exports.updatePatient = catchAsync(async (req, res, next) => {
  const patient = await patientService.updatePatient(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Patient updated successfully', { patient });
});

exports.deletePatient = catchAsync(async (req, res, next) => {
  const patient = await patientService.deletePatient(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Patient deactivated successfully', { patient });
});

exports.getPatientStats = catchAsync(async (req, res, next) => {
  const stats = await patientService.getPatientStats(req.params.id);
  apiResponse(res, 200, 'Patient statistics retrieved successfully', stats);
});