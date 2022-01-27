const AWS = require('aws-sdk');

const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
    region: process.env.AWS_SQS_REGION || 'us-west-1'
});

module.exports = sqs;
