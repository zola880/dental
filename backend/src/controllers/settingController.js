const settingService = require('../services/settingService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllSettings = catchAsync(async (req, res, next) => {
  const settings = await settingService.getAllSettings();
  apiResponse(res, 200, 'Settings retrieved successfully', { settings });
});

exports.getSettingByKey = catchAsync(async (req, res, next) => {
  const setting = await settingService.getSettingByKey(req.params.key);
  apiResponse(res, 200, 'Setting retrieved successfully', { setting });
});

exports.updateSetting = catchAsync(async (req, res, next) => {
  const { key } = req.params;
  const { value, description } = req.body;
  const setting = await settingService.updateSetting(key, value, description, req.user._id, req.ip);
  apiResponse(res, 200, 'Setting updated successfully', { setting });
});

exports.bulkUpdateSettings = catchAsync(async (req, res, next) => {
  const { settings } = req.body;
  const result = await settingService.bulkUpdateSettings(settings, req.user._id, req.ip);
  apiResponse(res, 200, 'Settings updated successfully', { settings: result });
});

exports.deleteSetting = catchAsync(async (req, res, next) => {
  const setting = await settingService.deleteSetting(req.params.key, req.user._id, req.ip);
  apiResponse(res, 200, 'Setting deleted successfully', { setting });
});

exports.initializeDefaultSettings = catchAsync(async (req, res, next) => {
  const settings = await settingService.initializeDefaultSettings();
  apiResponse(res, 200, 'Default settings initialized successfully', { settings });
});