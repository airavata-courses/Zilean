const moment = require('moment-timezone');

const db = require('../db/models');

const auditRepository = {};

auditRepository.getAllAudits = async function () {
    return await db.audits.findAll();
};

auditRepository.insert = async function (audit) {
    await db.audits.create({
        uuid: audit.uuid,
        user_id: audit.user_id,
        request: audit.request,
        response: audit.response,
        service_provider_identifier: audit.service_provider_identifier,
        created_at: moment.utc(),
        updated_at: moment.utc()
    });    
};

module.exports = auditRepository;
