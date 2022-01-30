class InvalidRequestBody extends Error {
  constructor(errors, httpCode, message) {
    super((message || 'Invalid Request Body'));
    this.httpCode = httpCode || 422;
    this.errors = errors;
  }
}

module.exports = InvalidRequestBody;
