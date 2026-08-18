const auditService = require('../services/auditService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAuditLogs = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, ...query } = req.query;
  const result = await auditService.getAuditLogs(query, page, limit);
  apiResponse(res, 200, 'Audit logs retrieved successfully', result.logs, result.meta);
});

exports.getAuditLogById = catchAsync(async (req, res, next) => {
  const log = await auditService.getAuditLogById(req.params.id);
  apiResponse(res, 200, 'Audit log retrieved successfully', { log });
});