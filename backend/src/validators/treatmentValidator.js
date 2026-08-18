const { body } = require('express-validator');

exports.createTreatmentValidator = [
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('dentist').isMongoId().withMessage('Valid dentist ID is required'),
  body('title').trim().notEmpty().withMessage('Treatment title is required'),
  body('status').optional().isIn(['planned', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
];

exports.updateTreatmentValidator = [
  body('patient').optional().isMongoId().withMessage('Valid patient ID is required'),
  body('dentist').optional().isMongoId().withMessage('Valid dentist ID is required'),
  body('title').optional().trim().notEmpty().withMessage('Treatment title cannot be empty'),
  body('status').optional().isIn(['planned', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('estimatedCost').optional().isFloat({ min: 0 }).withMessage('Estimated cost must be a positive number'),
];