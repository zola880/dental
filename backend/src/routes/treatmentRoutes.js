const express = require('express');
const treatmentController = require('../controllers/treatmentController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createTreatmentValidator, updateTreatmentValidator } = require('../validators/treatmentValidator');

const router = express.Router();

router.use(protect);

router.get('/', treatmentController.getAllTreatments);
router.get('/:id', treatmentController.getTreatmentById);
router.post('/', restrictTo('admin', 'dentist'), createTreatmentValidator, validate, treatmentController.createTreatment);
router.patch('/:id', restrictTo('admin', 'dentist'), updateTreatmentValidator, validate, treatmentController.updateTreatment);
router.delete('/:id', restrictTo('admin'), treatmentController.deleteTreatment);

router.get('/:id/records', treatmentController.getTreatmentRecords);
router.post('/:id/records', restrictTo('admin', 'dentist'), treatmentController.addTreatmentRecord);

module.exports = router;