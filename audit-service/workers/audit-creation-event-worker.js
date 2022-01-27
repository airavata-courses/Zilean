const sqs = require('../core/aws').sqs;
const logger = require('logger');
const moment = require('moment-timezone');
const _ = require('lodash');
const appConfig = require('../config/app');
const auditRepository = require('../repository/audit-repository');

const { Consumer } = require('sqs-consumer');


console.log(appConfig.audit_creation_queue_url);

const app = Consumer.create({
    queueUrl: appConfig.audit_creation_queue_url,
    handleMessage: async (message) => {
        console.log(message.MessageId);
        return true;
    },
    sqs
});

app.on('error', (err) => {
    console.error(err);
});

app.on('processing_error', (err) => {
    console.error(err);
});

app.start();


