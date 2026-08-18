const Expense = require('../models/Expense');
const AppError = require('../utils/appError');
const AuditLog = require('../models/AuditLog');

exports.getAllExpenses = async (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const filter = {};
  
  if (query.category) filter.category = query.category;
  
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) filter.date.$lte = new Date(query.endDate);
  }

  const sort = query.sort || '-date';
  
  const expenses = await Expense.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('recordedBy', 'firstName lastName');
  
  const total = await Expense.countDocuments(filter);

  return {
    expenses,
    meta: {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

exports.getExpenseById = async (id) => {
  const expense = await Expense.findById(id).populate('recordedBy', 'firstName lastName email');
  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }
  return expense;
};

exports.createExpense = async (expenseData, userId, ipAddress) => {
  expenseData.recordedBy = userId;
  const newExpense = await Expense.create(expenseData);
  
  await AuditLog.create({
    user: userId,
    action: 'CREATE',
    entity: 'Expense',
    entityId: newExpense._id,
    metadata: { category: newExpense.category, amount: newExpense.amount },
    ipAddress,
  });

  return await exports.getExpenseById(newExpense._id);
};

exports.updateExpense = async (id, updateData, userId, ipAddress) => {
  const expense = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  
  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'UPDATE',
    entity: 'Expense',
    entityId: expense._id,
    metadata: { updatedFields: Object.keys(updateData) },
    ipAddress,
  });

  return await exports.getExpenseById(expense._id);
};

exports.deleteExpense = async (id, userId, ipAddress) => {
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw new AppError('Expense not found.', 404);
  }

  await AuditLog.create({
    user: userId,
    action: 'DELETE',
    entity: 'Expense',
    entityId: expense._id,
    metadata: { amount: expense.amount },
    ipAddress,
  });

  return expense;
};