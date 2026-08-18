const Dentist = require('../models/Dentist');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Treatment = require('../models/Treatment');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllDentists = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (query.isAvailable !== undefined) {
    filter.isAvailable = query.isAvailable === 'true';
  }

  if (query.search) {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query.search, $options: 'i' } },
        { lastName: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
      ],
    }).select('_id');
    filter.user = { $in: users.map((u) => u._id) };
  }

  const sort = query.sort || '-createdAt';

  const dentists = await Dentist.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'firstName lastName email phone avatar');

  const total = await Dentist.countDocuments(filter);

  return {
    dentists,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getDentistById = async (id) => {
  const dentist = await Dentist.findById(id).populate(
    'user',
    'firstName lastName email phone avatar'
  );

  if (!dentist) {
    throw new AppError('Dentist not found.', 404);
  }

  return dentist;
};

exports.createDentist = async (dentistData, userId, ipAddress) => {
  const user = await User.findById(dentistData.user);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user.role !== 'dentist') {
    throw new AppError('User must have the dentist role.', 400);
  }

  const existingDentist = await Dentist.findOne({ user: dentistData.user });
  if (existingDentist) {
    throw new AppError('This user already has a dentist profile.', 400);
  }

  const existingLicense = await Dentist.findOne({ licenseNumber: dentistData.licenseNumber });
  if (existingLicense) {
    throw new AppError('This license number is already registered.', 400);
  }

  const newDentist = await Dentist.create(dentistData);

  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Dentist',
    entityId: newDentist._id,
    metadata: { userId: user._id, specialization: newDentist.specialization },
    ipAddress,
  });

  return await exports.getDentistById(newDentist._id);
};

exports.updateDentist = async (id, updateData, userId, ipAddress) => {
  if (updateData.licenseNumber) {
    const existingLicense = await Dentist.findOne({
      licenseNumber: updateData.licenseNumber,
      _id: { $ne: id },
    });
    if (existingLicense) {
      throw new AppError('This license number is already registered.', 400);
    }
  }

  const dentist = await Dentist.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!dentist) {
    throw new AppError('Dentist not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Dentist',
    entityId: dentist._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return await exports.getDentistById(dentist._id);
};

exports.deleteDentist = async (id, userId, ipAddress) => {
  const dentist = await Dentist.findById(id);
  if (!dentist) {
    throw new AppError('Dentist not found.', 404);
  }

  await User.findByIdAndUpdate(dentist.user, { status: 'inactive' });
  await Dentist.findByIdAndDelete(id);

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Dentist',
    entityId: dentist._id,
    ipAddress,
  });

  return dentist;
};

exports.getDentistStats = async (dentistId) => {
  const totalAppointments = await Appointment.countDocuments({ dentist: dentistId });
  const completedAppointments = await Appointment.countDocuments({
    dentist: dentistId,
    status: 'completed',
  });
  const upcomingAppointments = await Appointment.countDocuments({
    dentist: dentistId,
    startDateTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] },
  });
  const totalPatients = await Appointment.distinct('patient', {
    dentist: dentistId,
    status: 'completed',
  }).then((patients) => patients.length);
  const totalTreatments = await Treatment.countDocuments({ dentist: dentistId });

  return {
    totalAppointments,
    completedAppointments,
    upcomingAppointments,
    totalPatients,
    totalTreatments,
  };
};

exports.getDentistSchedule = async (dentistId, startDate, endDate) => {
  const appointments = await Appointment.find({
    dentist: dentistId,
    startDateTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
    status: { $nin: ['cancelled', 'no_show'] },
  })
    .sort('startDateTime')
    .populate('patient', 'firstName lastName phone');

  return appointments;
};