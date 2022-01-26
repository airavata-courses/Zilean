class ApplicationError extends Error {
    constructor(message, httpCode, errors) {
        super((message || 'Application Error'));
        this.httpCode = httpCode || 500;
        this.errors = errors;
    }   
}
module.exports = ApplicationError;
