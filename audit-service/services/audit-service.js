const auditService = {};
const auditRepository = require('../repository/audit-repository');

auditService.getAuditList = async () => {
    const auditList = await auditRepository.getAllAudits();
    console.log(auditList);
    return {
        audits: auditList,
        message: "Success"
    }
}

module.exports = auditService;