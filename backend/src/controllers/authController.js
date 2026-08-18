const authService = require('../services/authService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');
const env = require('../config/env');

exports.register = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.register(req.body, req.ip);
  
  const cookieOptions = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('jwt', token, cookieOptions);
  apiResponse(res, 201, 'User registered successfully', { user, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password, req.ip);

  const cookieOptions = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('jwt', token, cookieOptions);
  apiResponse(res, 200, 'Logged in successfully', { user, token });
});

exports.logout = catchAsync(async (req, res, next) => {
  await authService.logout(req.user?._id, req.ip);
  
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  
  apiResponse(res, 200, 'Logged out successfully');
});

exports.getMe = catchAsync(async (req, res, next) => {
  apiResponse(res, 200, 'User profile retrieved successfully', { user: req.user });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await authService.updatePassword(req.user._id, currentPassword, newPassword);
  
  const token = user.generateJWT();
  const cookieOptions = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('jwt', token, cookieOptions);
  apiResponse(res, 200, 'Password updated successfully', { user, token });
});