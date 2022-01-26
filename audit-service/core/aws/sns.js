const AWS = require('aws-sdk');

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  endpoint: process.env.NODE_ENV === 'development' ? process.env.AWS_LOCALSTACK_SNS_ENDPOINT : undefined,
  region: process.env.AWS_SNS_REGION || 'us-west-1'
});

module.exports = sns;
