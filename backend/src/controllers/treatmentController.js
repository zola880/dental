const treatmentService = require('../services/treatmentService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllTreatments = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await treatmentService.getAllTreatments(query, page, limit);
  apiResponse(res, 200, 'Treatments retrieved successfully', result.treatments, result.meta);
});

exports.getTreatmentById = catchAsync(async (req, res, next) => {
  const treatment = await treatmentService.getTreatmentById(req.params.id);
  apiResponse(res, 200, 'Treatment retrieved successfully', { treatment });
});

exports.createTreatment = catchAsync(async (req, res, next) => {
  const treatment = await treatmentService.createTreatment(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Treatment created successfully', { treatment });
});

exports.updateTreatment = catchAsync(async (req, res, next) => {
  const treatment = await treatmentService.updateTreatment(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Treatment updated successfully', { treatment });
});

exports.deleteTreatment = catchAsync(async (req, res, next) => {
  const treatment = await treatmentService.deleteTreatment(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Treatment cancelled successfully', { treatment });
});

exports.getTreatmentRecords = catchAsync(async (req, res, next) => {
  const records = await treatmentService.getTreatmentRecords(req.params.id);
  apiResponse(res, 200, 'Treatment records retrieved successfully', { records });
});

exports.addTreatmentRecord = catchAsync(async (req, res, next) => {
  const record = await treatmentService.addTreatmentRecord(
    { ...req.body, treatment: req.params.id },
    req.user._id,
    req.ip
  );
  apiResponse(res, 201, 'Treatment record added successfully', { record });
});