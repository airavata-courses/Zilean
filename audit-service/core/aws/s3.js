const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: process.env.AWS_S3_REGION || 'us-west-1'
});

module.exports = s3;
