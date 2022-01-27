
const logger = require('logger');
const responseHandler = require('response-handler');
const auditService = require('../services/audit-service');

const auditController = {};

auditController.getAuditList = async (req, res) => {
    try {
        const response = await auditService.getAuditList();
        responseHandler.respond(response, res);
    } catch (error) {
        logger.error('Error while retrieving document list ', error);
        responseHandler.handleError(error, res);
    }
};


module.exports = auditController;