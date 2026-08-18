const { body } = require('express-validator');

exports.createNotificationValidator = [
  body('user').isMongoId().withMessage('Valid user ID is required'),
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  body('type').optional().isIn(['info', 'warning', 'success', 'error', 'appointment', 'payment']).withMessage('Invalid notification type'),
  body('link').optional().trim().isLength({ max: 200 }).withMessage('Link cannot exceed 200 characters'),
];