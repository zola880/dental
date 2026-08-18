const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.user) filter.user = query.user;
  if (query.action) filter.action = query.action;
  if (query.entity) filter.entity = query.entity;
  if (query.entityId) filter.entityId = query.entityId;

  if (query.startDate || query.endDate) {
    filter.timestamp = {};
    if (query.startDate) filter.timestamp.$gte = new Date(query.startDate);
    if (query.endDate) filter.timestamp.$lte = new Date(query.endDate);
  }

  const logs = await AuditLog.find(filter)
    .sort('-timestamp')
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email role');

  const total = await AuditLog.countDocuments(filter);

  return {
    logs,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getAuditLogById = async (id) => {
  const log = await AuditLog.findById(id).populate('user', 'firstName lastName email role');
  return log;
};