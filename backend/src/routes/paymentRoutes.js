const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin', 'accountant', 'receptionist'), paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);
router.post('/', restrictTo('admin', 'accountant', 'receptionist'), paymentController.createPayment);
router.delete('/:id', restrictTo('admin'), paymentController.deletePayment);

module.exports = router;