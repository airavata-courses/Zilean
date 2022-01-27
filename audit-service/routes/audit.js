const express = require('express');

const router = express.Router();

const auditController = require('../controllers/audit-controller');

router.get('/audit', auditController.getAuditList);

router.post('/audit', auditController.createAudit);

module.exports = router;
