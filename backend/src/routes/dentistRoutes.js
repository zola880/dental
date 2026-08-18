const express = require('express');
const dentistController = require('../controllers/dentistController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createDentistValidator, updateDentistValidator } = require('../validators/dentistValidator');

const router = express.Router();

router.use(protect);

router.get('/', dentistController.getAllDentists);
router.get('/:id', dentistController.getDentistById);
router.post('/', restrictTo('admin'), createDentistValidator, validate, dentistController.createDentist);
router.patch('/:id', restrictTo('admin'), updateDentistValidator, validate, dentistController.updateDentist);
router.delete('/:id', restrictTo('admin'), dentistController.deleteDentist);

router.get('/:id/stats', dentistController.getDentistStats);
router.get('/:id/schedule', dentistController.getDentistSchedule);

module.exports = router;