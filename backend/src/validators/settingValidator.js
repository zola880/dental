const { body } = require('express-validator');

exports.updateSettingValidator = [
  body('key').trim().notEmpty().withMessage('Setting key is required'),
  body('value').exists().withMessage('Setting value is required'),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
];

exports.bulkUpdateSettingsValidator = [
  body('settings').isArray({ min: 1 }).withMessage('Settings array is required'),
  body('settings.*.key').trim().notEmpty().withMessage('Each setting must have a key'),
  body('settings.*.value').exists().withMessage('Each setting must have a value'),
];