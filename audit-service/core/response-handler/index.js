/* eslint-disable no-param-reassign */
const response = {};
const { ApplicationError, InternalServerError } = require('errors');
const logger = require('logger');

response.handleError = (error, res) => {
    let errorObj = error;
    logger.error('Request failed: ', error);
    if (!(error instanceof ApplicationError)) {
        errorObj = new InternalServerError(errorObj);
    }
    res.status(errorObj.httpCode).json(errorObj.errors);
};

response.respond = (
    data,
    res
) => {
    res.status(200).json(data);
};

response.downloadFile = (res, fileData, fileName, fileType, downloadType = 'attachment') => {
    res.setHeader('Content-disposition', `${downloadType}; filename="${fileName}"`);
    res.set('Content-Type', fileType);
    res.status(200).send(fileData);
};

response.downloadFileStream = (res, fileStream, fileName, fileType) => {
    res.setHeader('Content-disposition', `attachment; filename=${fileName}`);
    res.set('Content-Type', fileType);
    fileStream.pipe(res);
};


module.exports = response;
