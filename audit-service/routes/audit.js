const express = require('express');

const router = express.Router();

const auditController = require('../controllers/audit-controller');

router.get('/audits', auditController.getAuditList);

router.post('/audits', auditController.createAudit);

module.exports = router;
