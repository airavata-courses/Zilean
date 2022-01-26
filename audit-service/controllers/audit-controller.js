
const logger = require('logger');
const responseHandler = require('response-handler');

const auditController = {};

auditController.getAuditList = async (req, res) => {
    try {
        const response = {
            "message": "Success"
        };
        responseHandler.respond(response, res);
    } catch (error) {
        logger.error('Error while retrieving document list ', error);
        responseHandler.handleError(error, res);
    }
};


module.exports = auditController;