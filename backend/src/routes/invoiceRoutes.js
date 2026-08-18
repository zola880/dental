const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createInvoiceValidator, updateInvoiceValidator } = require('../validators/invoiceValidator');

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin', 'accountant', 'receptionist'), invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.post('/', restrictTo('admin', 'accountant', 'receptionist'), createInvoiceValidator, validate, invoiceController.createInvoice);
router.patch('/:id', restrictTo('admin', 'accountant'), updateInvoiceValidator, validate, invoiceController.updateInvoice);
router.delete('/:id', restrictTo('admin'), invoiceController.deleteInvoice);

router.get('/:id/payments', invoiceController.getInvoicePayments);

module.exports = router;