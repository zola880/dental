const express = require('express');
const auditController = require('../controllers/auditController');
const { protect } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/', auditController.getAuditLogs);
router.get('/:id', auditController.getAuditLogById);

module.exports = router;