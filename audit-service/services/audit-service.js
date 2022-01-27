const auditService = {};

const uuid = require('uuid');
const auditRepository = require('../repository/audit-repository');

auditService.getAuditList = async (pageInfo) => {
    return await auditRepository.getPaginatedAudits({
        cursor: pageInfo.cursor,
        limit: pageInfo.limit
    });
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