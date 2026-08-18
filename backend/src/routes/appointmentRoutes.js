const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createAppointmentValidator, updateAppointmentValidator } = require('../validators/appointmentValidator');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', appointmentController.getAllAppointments);
router.get('/calendar', appointmentController.getAppointmentsByDateRange);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', restrictTo('admin', 'receptionist', 'dentist'), createAppointmentValidator, validate, appointmentController.createAppointment);
router.patch('/:id', restrictTo('admin', 'receptionist', 'dentist'), updateAppointmentValidator, validate, appointmentController.updateAppointment);
router.delete('/:id', restrictTo('admin', 'receptionist'), appointmentController.deleteAppointment);

module.exports = router;