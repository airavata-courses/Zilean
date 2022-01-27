const auditService = {};

const uuid = require('uuid');
const auditRepository = require('../repository/audit-repository');

auditService.getAuditList = async () => {
    const auditList = await auditRepository.getAllAudits();
    return {
        audits: auditList,
        message: "Success"
    }
}

auditService.createAudit = async (audit) => {
    await auditRepository.insert({
        ...audit,
        uuid: uuid.v4()
    });
    return {
        message: "Success"
    }
}

module.exports = auditService;