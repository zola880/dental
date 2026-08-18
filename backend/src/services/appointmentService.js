const Appointment = require('../models/Appointment');
const Dentist = require('../models/Dentist');
const Patient = require('../models/Patient');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllAppointments = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.patient) filter.patient = query.patient;
  if (query.dentist) filter.dentist = query.dentist;
  if (query.status) filter.status = query.status;
  if (query.type) filter.type = query.type;
  
  // Date range filtering
  if (query.startDate || query.endDate) {
    filter.startDateTime = {};
    if (query.startDate) filter.startDateTime.$gte = new Date(query.startDate);
    if (query.endDate) filter.startDateTime.$lte = new Date(query.endDate);
  }

  const sort = query.sort || 'startDateTime';
  
  const appointments = await Appointment.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('patient', 'firstName lastName phone email')
    .populate({
      path: 'dentist',
      populate: { path: 'user', select: 'firstName lastName email' }
    })
    .populate('service', 'name duration price');
  
  const total = await Appointment.countDocuments(filter);

  return {
    appointments,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate('patient', 'firstName lastName phone email dateOfBirth gender')
    .populate({
      path: 'dentist',
      populate: { path: 'user', select: 'firstName lastName email phone' }
    })
    .populate('service', 'name duration price');
  
  if (!appointment) {
    throw new AppError('Appointment not found.', 404);
  }
  
  return appointment;
};

exports.createAppointment = async (appointmentData, userId, ipAddress) => {
  // Verify patient exists
  const patient = await Patient.findById(appointmentData.patient);
  if (!patient) {
    throw new AppError('Patient not found.', 404);
  }

  // Verify dentist exists
  const dentist = await Dentist.findById(appointmentData.dentist);
  if (!dentist) {
    throw new AppError('Dentist not found.', 404);
  }

  // Check for overlapping appointments
  const overlapping = await Appointment.findOne({
    dentist: appointmentData.dentist,
    startDateTime: { $lt: appointmentData.endDateTime },
    endDateTime: { $gt: appointmentData.startDateTime },
    status: { $nin: ['cancelled', 'no_show'] }
  });

  if (overlapping) {
    throw new AppError('This time slot is already booked for the selected dentist.', 400);
  }

  const newAppointment = await Appointment.create(appointmentData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Appointment',
    entityId: newAppointment._id,
    metadata: { 
      patientId: patient._id,
      dentistId: dentist._id,
      date: newAppointment.startDateTime
    },
    ipAddress,
  });

  return await exports.getAppointmentById(newAppointment._id);
};

exports.updateAppointment = async (id, updateData, userId, ipAddress) => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new AppError('Appointment not found.', 404);
  }

  // If changing dentist or time, check for overlaps
  if (updateData.dentist || updateData.startDateTime || updateData.endDateTime) {
    const dentistId = updateData.dentist || appointment.dentist;
    const startDateTime = updateData.startDateTime || appointment.startDateTime;
    const endDateTime = updateData.endDateTime || appointment.endDateTime;

    const overlapping = await Appointment.findOne({
      _id: { $ne: id },
      dentist: dentistId,
      startDateTime: { $lt: endDateTime },
      endDateTime: { $gt: startDateTime },
      status: { $nin: ['cancelled', 'no_show'] }
    });

    if (overlapping) {
      throw new AppError('This time slot is already booked for the selected dentist.', 400);
    }
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Appointment',
    entityId: updatedAppointment._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return await exports.getAppointmentById(updatedAppointment._id);
};

exports.deleteAppointment = async (id, userId, ipAddress) => {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true }
  );
  
  if (!appointment) {
    throw new AppError('Appointment not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Appointment',
    entityId: appointment._id,
    metadata: { status: 'cancelled' },
    ipAddress,
  });

  return appointment;
};

exports.getAppointmentsByDateRange = async (startDate, endDate, dentistId = null) => {
  const filter = {
    startDateTime: { $gte: new Date(startDate), $lte: new Date(endDate) }
  };

  if (dentistId) {
    filter.dentist = dentistId;
  }

  const appointments = await Appointment.find(filter)
    .sort('startDateTime')
    .populate('patient', 'firstName lastName phone')
    .populate({
      path: 'dentist',
      populate: { path: 'user', select: 'firstName lastName' }
    })
    .populate('service', 'name');

  return appointments;
};