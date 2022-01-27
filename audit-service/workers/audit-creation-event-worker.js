const { sqs } = require('../core/aws');
const { AdvancedSqsConsumer } = require('advanced-sqs-consumer');
const logger = require('logger');
const moment = require('moment-timezone');
const _ = require('lodash');
const appConfig = require('../config/app');
const auditRepository = require('../repository/audit-repository');

const app = AdvancedSqsConsumer.create({
    queueUrl: appConfig.audit_creation_queue_url,
    logger,
    maxRetryCount: 2,
    handleMessage: async (message) => {
        logger.info('Audit Creation Worker:', message);
        const data = JSON.parse(JSON.parse(message.Body).Message);
        console.log(data);
        logger.info(`Audit Creation Worker: userId: ${userId}`);
    },
    sqs
});

app.start();
