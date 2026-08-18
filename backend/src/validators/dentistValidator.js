const { body } = require('express-validator');

exports.createDentistValidator = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('schedule.workingDays').optional().isArray().withMessage('Working days must be an array'),
  body('schedule.workingDays.*').optional().isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).withMessage('Invalid day'),
];

exports.updateDentistValidator = [
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('licenseNumber').optional().trim().notEmpty().withMessage('License number cannot be empty'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be a boolean'),
];