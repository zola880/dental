const Service = require('../models/Service');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllServices = async (query, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.category) filter.category = query.category;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  if (query.search) {
    filter.name = { $regex: query.search, $options: 'i' };
  }

  const sort = query.sort || 'name';

  const services = await Service.find(filter).sort(sort).skip(skip).limit(limit);
  const total = await Service.countDocuments(filter);

  return {
    services,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getServiceById = async (id) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new AppError('Service not found.', 404);
  }
  return service;
};

exports.createService = async (serviceData, userId, ipAddress) => {
  const existingService = await Service.findOne({ name: serviceData.name });
  if (existingService) {
    throw new AppError('A service with this name already exists.', 400);
  }

  const newService = await Service.create(serviceData);

  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Service',
    entityId: newService._id,
    metadata: { name: newService.name, price: newService.price },
    ipAddress,
  });

  return newService;
};

exports.updateService = async (id, updateData, userId, ipAddress) => {
  if (updateData.name) {
    const existingService = await Service.findOne({
      name: updateData.name,
      _id: { $ne: id },
    });
    if (existingService) {
      throw new AppError('A service with this name already exists.', 400);
    }
  }

  const service = await Service.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    throw new AppError('Service not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Service',
    entityId: service._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return service;
};

exports.deleteService = async (id, userId, ipAddress) => {
  const service = await Service.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  if (!service) {
    throw new AppError('Service not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Service',
    entityId: service._id,
    metadata: { name: service.name },
    ipAddress,
  });

  return service;
};