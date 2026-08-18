const express = require('express');
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createServiceValidator, updateServiceValidator } = require('../validators/serviceValidator');

const router = express.Router();

router.use(protect);

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.post('/', restrictTo('admin'), createServiceValidator, validate, serviceController.createService);
router.patch('/:id', restrictTo('admin'), updateServiceValidator, validate, serviceController.updateService);
router.delete('/:id', restrictTo('admin'), serviceController.deleteService);

module.exports = router;