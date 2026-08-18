const User = require('../models/User');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.register = async (userData, ipAddress) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError('Email already in use. Please use a different email.', 400);
  }

  const newUser = await User.create(userData);
  
  await AuditLog.create({
    user: newUser._id,
    action: 'CREATE',
    entity: 'User',
    entityId: newUser._id,
    ipAddress,
  });

  const token = newUser.generateJWT();
  return { user: newUser, token };
};

exports.login = async (email, password, ipAddress) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password.', 401);
  }

  if (user.status !== 'active') {
    throw new AppError('Your account is inactive or suspended. Please contact support.', 403);
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  await AuditLog.create({
    user: user._id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user._id,
    ipAddress,
  });

  const token = user.generateJWT();
  return { user, token };
};

exports.logout = async (userId, ipAddress) => {
  if (userId) {
    await AuditLog.create({
      user: userId,
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      ipAddress,
    });
  }
  return true;
};

exports.updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError('Your current password is incorrect.', 401);
  }

  user.password = newPassword;
  await user.save();

  return user;
};