const express = require('express');
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', restrictTo('admin', 'accountant'), expenseController.getAllExpenses);
router.get('/:id', restrictTo('admin', 'accountant'), expenseController.getExpenseById);
router.post('/', restrictTo('admin', 'accountant'), expenseController.createExpense);
router.patch('/:id', restrictTo('admin', 'accountant'), expenseController.updateExpense);
router.delete('/:id', restrictTo('admin'), expenseController.deleteExpense);

module.exports = router;