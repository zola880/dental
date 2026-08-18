const userService = require('../services/userService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await userService.getAllUsers(query, page, limit);
  apiResponse(res, 200, 'Users retrieved successfully', result.users, result.meta);
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);
  apiResponse(res, 200, 'User retrieved successfully', { user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);
  apiResponse(res, 200, 'User updated successfully', { user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await userService.deleteUser(req.params.id);
  apiResponse(res, 200, 'User deactivated successfully', { user });
});