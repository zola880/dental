const Treatment = require('../models/Treatment');
const TreatmentRecord = require('../models/TreatmentRecord');
const Patient = require('../models/Patient');
const Dentist = require('../models/Dentist');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllTreatments = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.patient) filter.patient = query.patient;
  if (query.dentist) filter.dentist = query.dentist;
  if (query.status) filter.status = query.status;
  
  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  const sort = query.sort || '-createdAt';
  
  const treatments = await Treatment.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('patient', 'firstName lastName phone')
    .populate({
      path: 'dentist',
      populate: { path: 'user', select: 'firstName lastName' }
    });
  
  const total = await Treatment.countDocuments(filter);

  return {
    treatments,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getTreatmentById = async (id) => {
  const treatment = await Treatment.findById(id)
    .populate('patient', 'firstName lastName phone email dateOfBirth')
    .populate({
      path: 'dentist',
      populate: { path: 'user', select: 'firstName lastName email phone' }
    });
  
  if (!treatment) {
    throw new AppError('Treatment not found.', 404);
  }
  
  return treatment;
};

exports.createTreatment = async (treatmentData, userId, ipAddress) => {
  const patient = await Patient.findById(treatmentData.patient);
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  const dentist = await Dentist.findById(treatmentData.dentist);
  if (!dentist) {
    throw new AppError('Dentist not found.', 404);
  }

  const newTreatment = await Treatment.create(treatmentData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Treatment',
    entityId: newTreatment._id,
    metadata: { patientId: patient._id, title: newTreatment.title },
    ipAddress,
  });

  return await exports.getTreatmentById(newTreatment._id);
};

exports.updateTreatment = async (id, updateData, userId, ipAddress) => {
  const treatment = await Treatment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  
  if (!treatment) {
    throw new AppError('Treatment not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Treatment',
    entityId: treatment._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return await exports.getTreatmentById(treatment._id);
};

exports.deleteTreatment = async (id, userId, ipAddress) => {
  const treatment = await Treatment.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true }
  );
  
  if (!treatment) {
    throw new AppError('Treatment not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Treatment',
    entityId: treatment._id,
    metadata: { status: 'cancelled' },
    ipAddress,
  });

  return treatment;
};

exports.getTreatmentRecords = async (treatmentId) => {
  const records = await TreatmentRecord.find({ treatment: treatmentId })
    .populate('dentist', 'firstName lastName')
    .sort('-date');
  
  return records;
};

exports.addTreatmentRecord = async (recordData, userId, ipAddress) => {
  const treatment = await Treatment.findById(recordData.treatment);
  if (!treatment) {
    throw new AppError('Treatment not found.', 404);
  }

  const newRecord = await TreatmentRecord.create(recordData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'TreatmentRecord',
    entityId: newRecord._id,
    metadata: { treatmentId: treatment._id, procedure: newRecord.procedureName },
    ipAddress,
  });

  return newRecord;
};