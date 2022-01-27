const auditRepository = {};

const db = require('../db/models');

auditRepository.getAllAudits = async function () {
    try {
        return await db.audits.findAll();
    } catch(err) {
        console.log(err);
    }
    
};

module.exports = auditRepository;
