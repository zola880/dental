const ClinicSetting = require('../models/ClinicSetting');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllSettings = async () => {
  const settings = await ClinicSetting.find();
  const settingsObj = {};
  settings.forEach((setting) => {
    settingsObj[setting.key] = {
      value: setting.value,
      description: setting.description,
    };
  });
  return settingsObj;
};

exports.getSettingByKey = async (key) => {
  const setting = await ClinicSetting.findOne({ key });
  if (!setting) {
    throw new AppError('Setting not found.', 404);
  }
  return setting;
};

exports.updateSetting = async (key, value, description, userId, ipAddress) => {
  const setting = await ClinicSetting.findOneAndUpdate(
    { key },
    { value, description },
    { new: true, upsert: true, runValidators: true }
  );

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'ClinicSetting',
    entityId: setting._id,
    metadata: { key, value },
    ipAddress,
  });

  return setting;
};

exports.bulkUpdateSettings = async (settings, userId, ipAddress) => {
  const operations = settings.map((s) => ({
    updateOne: {
      filter: { key: s.key },
      update: { $set: { value: s.value, description: s.description } },
      upsert: true,
    },
  }));

  await ClinicSetting.bulkWrite(operations);

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'ClinicSetting',
    metadata: { bulkUpdate: true, count: settings.length },
    ipAddress,
  });

  return await exports.getAllSettings();
};

exports.deleteSetting = async (key, userId, ipAddress) => {
  const setting = await ClinicSetting.findOneAndDelete({ key });
  if (!setting) {
    throw new AppError('Setting not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'ClinicSetting',
    entityId: setting._id,
    metadata: { key },
    ipAddress,
  });

  return setting;
};

exports.initializeDefaultSettings = async () => {
  const defaults = [
    {
      key: 'clinic_name',
      value: 'DentalCare Pro',
      description: 'Name of the clinic',
    },
    {
      key: 'clinic_address',
      value: '123 Main Street, City, Country',
      description: 'Clinic physical address',
    },
    {
      key: 'clinic_phone',
      value: '+1 (555) 123-4567',
      description: 'Main clinic phone number',
    },
    {
      key: 'clinic_email',
      value: 'contact@dentalcare.com',
      description: 'Main clinic email',
    },
    {
      key: 'working_hours',
      value: {
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '10:00', close: '14:00' },
        sunday: { open: null, close: null },
      },
      description: 'Clinic working hours',
    },
    {
      key: 'currency',
      value: 'USD',
      description: 'Default currency for billing',
    },
    {
      key: 'tax_rate',
      value: 0,
      description: 'Default tax rate (percentage)',
    },
    {
      key: 'appointment_duration',
      value: 30,
      description: 'Default appointment duration in minutes',
    },
  ];

  for (const setting of defaults) {
    await ClinicSetting.findOneAndUpdate(
      { key: setting.key },
      setting,
      { upsert: true, new: true }
    );
  }

  return await exports.getAllSettings();
};