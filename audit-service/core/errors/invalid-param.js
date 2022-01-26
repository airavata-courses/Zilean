class InvalidParameter extends Error {
  constructor(errors, httpCode, message) {
    super((message || 'Invalid Parameter'));
    this.httpCode = httpCode || 422;
    this.errors = errors;
  }
}

module.exports = InvalidParameter;
