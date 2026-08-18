const express = require('express');
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createPatientValidator, updatePatientValidator } = require('../validators/patientValidator');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', patientController.getAllPatients);
router.get('/stats/:id', patientController.getPatientStats);
router.get('/:id', patientController.getPatientById);
router.post('/', restrictTo('admin', 'receptionist'), createPatientValidator, validate, patientController.createPatient);
router.patch('/:id', restrictTo('admin', 'receptionist', 'dentist'), updatePatientValidator, validate, patientController.updatePatient);
router.delete('/:id', restrictTo('admin'), patientController.deletePatient);

module.exports = router;