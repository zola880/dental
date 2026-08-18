const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createNotificationValidator } = require('../validators/notificationValidator');

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.post('/', restrictTo('admin'), createNotificationValidator, validate, notificationController.createNotification);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);
router.delete('/', notificationController.deleteAllNotifications);

module.exports = router;