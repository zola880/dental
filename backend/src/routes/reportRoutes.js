const express = require('express');
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.get('/financial-summary', restrictTo('admin', 'accountant'), reportController.getFinancialSummary);
router.get('/revenue-by-service', restrictTo('admin', 'accountant'), reportController.getRevenueByService);
router.get('/revenue-by-period', restrictTo('admin', 'accountant'), reportController.getRevenueByPeriod);
router.get('/dashboard-stats', reportController.getDashboardStats);

module.exports = router;