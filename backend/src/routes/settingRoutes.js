const express = require('express');
const settingController = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { updateSettingValidator, bulkUpdateSettingsValidator } = require('../validators/settingValidator');

const router = express.Router();

router.use(protect);

router.get('/', settingController.getAllSettings);
router.get('/:key', settingController.getSettingByKey);
router.put('/:key', restrictTo('admin'), updateSettingValidator, validate, settingController.updateSetting);
router.put('/', restrictTo('admin'), bulkUpdateSettingsValidator, validate, settingController.bulkUpdateSettings);
router.delete('/:key', restrictTo('admin'), settingController.deleteSetting);
router.post('/initialize', restrictTo('admin'), settingController.initializeDefaultSettings);

module.exports = router;