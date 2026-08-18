const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Treatment = require('../models/Treatment');
const MedicalHistory = require('../models/MedicalHistory');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllPatients = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  // Search by name, phone, or email
  if (query.search) {
    filter.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  
  if (query.status) filter.status = query.status;
  if (query.gender) filter.gender = query.gender;

  // Sorting
  const sort = query.sort || '-createdAt';
  
  const patients = await Patient.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  const total = await Patient.countDocuments(filter);

  return {
    patients,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getPatientById = async (id) => {
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }
  return patient;
};

exports.createPatient = async (patientData, userId, ipAddress) => {
  // Check if phone already exists
  const existingPatient = await Patient.findOne({ phone: patientData.phone });
  if (existingPatient) {
    throw new AppError('A patient with this phone number already exists.', 400);
  }

  const newPatient = await Patient.create(patientData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Patient',
    entityId: newPatient._id,
    metadata: { patientName: newPatient.fullName },
    ipAddress,
  });

  return newPatient;
};

exports.updatePatient = async (id, updateData, userId, ipAddress) => {
  const patient = await Patient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Patient',
    entityId: patient._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return patient;
};

exports.deletePatient = async (id, userId, ipAddress) => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    { status: 'inactive' },
    { new: true }
  );
  
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Patient',
    entityId: patient._id,
    metadata: { patientName: patient.fullName },
    ipAddress,
  });

  return patient;
};

exports.getPatientStats = async (patientId) => {
  const totalAppointments = await Appointment.countDocuments({ patient: patientId });
  const completedAppointments = await Appointment.countDocuments({ 
    patient: patientId, 
    status: 'completed' 
  });
  const totalTreatments = await Treatment.countDocuments({ patient: patientId });
  const medicalRecords = await MedicalHistory.countDocuments({ patient: patientId });

  return {
    totalAppointments,
    completedAppointments,
    totalTreatments,
    medicalRecords,
  };
};