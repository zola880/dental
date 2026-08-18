const { body } = require('express-validator');

exports.createAppointmentValidator = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('dentist').isMongoId().withMessage('Valid dentist ID is required'),
  body('service').optional().isMongoId().withMessage('Valid service ID is required'),
  body('startDateTime').isISO8601().withMessage('Valid start date and time is required'),
  body('endDateTime').isISO8601().withMessage('Valid end date and time is required')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDateTime)) {
        throw new Error('End date and time must be after start date and time');
      }
      return true;
    }),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('type').optional().isIn(['checkup', 'follow_up', 'emergency', 'consultation', 'procedure']).withMessage('Invalid appointment type'),
];

exports.updateAppointmentValidator = [
  body('patient').optional().isMongoId().withMessage('Valid patient ID is required'),
  body('dentist').optional().isMongoId().withMessage('Valid dentist ID is required'),
  body('service').optional().isMongoId().withMessage('Valid service ID is required'),
  body('startDateTime').optional().isISO8601().withMessage('Valid start date and time is required'),
  body('endDateTime').optional().isISO8601().withMessage('Valid end date and time is required'),
  body('status').optional().isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']).withMessage('Invalid status'),
  body('type').optional().isIn(['checkup', 'follow_up', 'emergency', 'consultation', 'procedure']).withMessage('Invalid appointment type'),
];