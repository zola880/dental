const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

exports.getFinancialSummary = async (startDate, endDate) => {
  const dateFilter = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  // Revenue from payments
  const payments = await Payment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  // Expenses
  const expenses = await Expense.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  const totalRevenue = payments[0]?.totalRevenue || 0;
  const totalExpenses = expenses[0]?.totalExpenses || 0;
  const netIncome = totalRevenue - totalExpenses;

  // Outstanding payments (unpaid invoices)
  const outstandingInvoices = await Invoice.find({
    status: { $in: ['pending', 'partially_paid'] },
    createdAt: { $lte: new Date(endDate) }
  });

  const outstandingAmount = outstandingInvoices.reduce((sum, inv) => {
    return sum + (inv.totalAmount - inv.paidAmount);
  }, 0);

  return {
    totalRevenue,
    totalExpenses,
    netIncome,
    outstandingAmount,
    paymentCount: payments[0]?.count || 0,
    expenseCount: expenses[0]?.count || 0,
  };
};

exports.getRevenueByService = async (startDate, endDate) => {
  const payments = await Payment.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $lookup: {
        from: 'invoices',
        localField: 'invoice',
        foreignField: '_id',
        as: 'invoiceData'
      }
    },
    { $unwind: '$invoiceData' },
    {
      $group: {
        _id: '$invoiceData.service',
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service'
      }
    },
    { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        serviceName: { $ifNull: ['$service.name', 'Unknown Service'] },
        totalRevenue: 1,
        count: 1
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);

  return payments;
};

exports.getRevenueByPeriod = async (period = 'monthly') => {
  const groupBy = period === 'daily' 
    ? { year: { $year: '$date' }, month: { $month: '$date' }, day: { $dayOfMonth: '$date' } }
    : { year: { $year: '$date' }, month: { $month: '$date' } };

  const revenue = await Payment.aggregate([
    {
      $group: {
        _id: groupBy,
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
    { $limit: 12 }
  ]);

  return revenue;
};

exports.getDashboardStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const totalPatients = await Patient.countDocuments({ status: 'active' });
  
  const todayAppointments = await Appointment.countDocuments({
    startDateTime: { $gte: today, $lt: tomorrow }
  });

  const upcomingAppointments = await Appointment.countDocuments({
    startDateTime: { $gte: tomorrow },
    status: { $in: ['scheduled', 'confirmed'] }
  });

  const completedAppointments = await Appointment.countDocuments({
    status: 'completed'
  });

  // This month's revenue
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const payments = await Payment.aggregate([
    {
      $match: {
        date: { $gte: startOfMonth }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);

  const monthlyRevenue = payments[0]?.total || 0;

  // Pending payments
  const pendingInvoices = await Invoice.find({
    status: { $in: ['pending', 'partially_paid'] }
  });

  const pendingPayments = pendingInvoices.reduce((sum, inv) => {
    return sum + (inv.totalAmount - inv.paidAmount);
  }, 0);

  return {
    totalPatients,
    todayAppointments,
    upcomingAppointments,
    completedAppointments,
    monthlyRevenue,
    pendingPayments,
  };
};