const serviceService = require('../services/serviceService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllServices = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 50, ...query } = req.query;
  const result = await serviceService.getAllServices(query, page, limit);
  apiResponse(res, 200, 'Services retrieved successfully', result.services, result.meta);
});

exports.getServiceById = catchAsync(async (req, res, next) => {
  const service = await serviceService.getServiceById(req.params.id);
  apiResponse(res, 200, 'Service retrieved successfully', { service });
});

exports.createService = catchAsync(async (req, res, next) => {
  const service = await serviceService.createService(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Service created successfully', { service });
});

exports.updateService = catchAsync(async (req, res, next) => {
  const service = await serviceService.updateService(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Service updated successfully', { service });
});

exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await serviceService.deleteService(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Service deactivated successfully', { service });
});