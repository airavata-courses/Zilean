const aws = {};

aws.s3 = require('./s3');
aws.sns = require('./sns');

module.exports = aws;
