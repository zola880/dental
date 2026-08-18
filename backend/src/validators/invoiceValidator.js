const { body } = require('express-validator');

exports.createInvoiceValidator = [
  body('invoiceNumber').trim().notEmpty().withMessage('Invoice number is required'),
  body('patient').isMongoId().withMessage('Valid patient ID is required'),
  body('appointment').optional().isMongoId().withMessage('Valid appointment ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.description').trim().notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
];

exports.updateInvoiceValidator = [
  body('invoiceNumber').optional().trim().notEmpty().withMessage('Invoice number cannot be empty'),
  body('patient').optional().isMongoId().withMessage('Valid patient ID is required'),
  body('items').optional().isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.description').optional().trim().notEmpty().withMessage('Item description is required'),
  body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice').optional().isFloat({ min: 0 }).withMessage('Unit price must be a positive number'),
  body('discount').optional().isFloat({ min: 0 }).withMessage('Discount must be a positive number'),
  body('tax').optional().isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
];