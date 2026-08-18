const Notification = require('../models/Notification');
const AppError = require('../utils/appError');

exports.getNotifications = async (userId, query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const filter = { user: userId };

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === 'true';
  }

  if (query.type) {
    filter.type = query.type;
  }

  const notifications = await Notification.find(filter)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

  return {
    notifications,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
      unreadCount,
    },
  };
};

exports.getNotificationById = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }
  return notification;
};

exports.createNotification = async (notificationData) => {
  const newNotification = await Notification.create(notificationData);
  return newNotification;
};

exports.markAsRead = async (id, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }

  return notification;
};

exports.markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
  return { modifiedCount: result.modifiedCount };
};

exports.deleteNotification = async (id, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
  if (!notification) {
    throw new AppError('Notification not found.', 404);
  }
  return notification;
};

exports.deleteAllNotifications = async (userId) => {
  const result = await Notification.deleteMany({ user: userId });
  return { deletedCount: result.deletedCount };
};