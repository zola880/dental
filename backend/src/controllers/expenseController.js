const expenseService = require('../services/expenseService');
const apiResponse = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

exports.getAllExpenses = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, ...query } = req.query;
  const result = await expenseService.getAllExpenses(query, page, limit);
  apiResponse(res, 200, 'Expenses retrieved successfully', result.expenses, result.meta);
});

exports.getExpenseById = catchAsync(async (req, res, next) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  apiResponse(res, 200, 'Expense retrieved successfully', { expense });
});

exports.createExpense = catchAsync(async (req, res, next) => {
  const expense = await expenseService.createExpense(req.body, req.user._id, req.ip);
  apiResponse(res, 201, 'Expense recorded successfully', { expense });
});

exports.updateExpense = catchAsync(async (req, res, next) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body, req.user._id, req.ip);
  apiResponse(res, 200, 'Expense updated successfully', { expense });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const expense = await expenseService.deleteExpense(req.params.id, req.user._id, req.ip);
  apiResponse(res, 200, 'Expense deleted successfully', { expense });
});