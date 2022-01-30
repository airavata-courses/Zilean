const moment = require('moment-timezone');

const db = require('../db/models');
const ValuePaginator = require('../core/utils/value-paginator');
const auditRepository = {};

auditRepository.getPaginatedAudits = async function (pageInfo) {

    const auditDefaultSort = [{
            key: 'created_at',
            order: 'DESC'
        },
        {
            key: 'id',
            order: 'DESC'
        }
    ];

    const valuePaginator = new ValuePaginator(db.audits, auditDefaultSort, {}, []);
    return valuePaginator.paginate(pageInfo.cursor, parseInt(pageInfo.limit, 10));

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
