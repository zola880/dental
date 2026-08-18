const notificationService = require('../services/notificationService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, ...query } = req.query;
  const result = await notificationService.getNotifications(req.user._id, query, page, limit);
  apiResponse(res, 200, 'Notifications retrieved successfully', result.notifications, result.meta);
});

exports.getNotificationById = catchAsync(async (req, res, next) => {
  const notification = await notificationService.getNotificationById(req.params.id, req.user._id);
  apiResponse(res, 200, 'Notification retrieved successfully', { notification });
});

exports.createNotification = catchAsync(async (req, res, next) => {
  const notification = await notificationService.createNotification(req.body);
  apiResponse(res, 201, 'Notification created successfully', { notification });
});

exports.markAsRead = catchAsync(async (req, res, next) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user._id);
  apiResponse(res, 200, 'Notification marked as read', { notification });
});

exports.markAllAsRead = catchAsync(async (req, res, next) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  apiResponse(res, 200, 'All notifications marked as read', result);
});

exports.deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await notificationService.deleteNotification(req.params.id, req.user._id);
  apiResponse(res, 200, 'Notification deleted successfully', { notification });
});

exports.deleteAllNotifications = catchAsync(async (req, res, next) => {
  const result = await notificationService.deleteAllNotifications(req.user._id);
  apiResponse(res, 200, 'All notifications deleted successfully', result);
});