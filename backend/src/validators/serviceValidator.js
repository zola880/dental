const { body } = require('express-validator');

exports.createServiceValidator = [
  body('name').trim().notEmpty().withMessage('Service name is required').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('duration').isInt({ min: 5 }).withMessage('Duration must be at least 5 minutes'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim().isLength({ max: 50 }).withMessage('Category cannot exceed 50 characters'),
];

exports.updateServiceValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty').isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  body('duration').optional().isInt({ min: 5 }).withMessage('Duration must be at least 5 minutes'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
];