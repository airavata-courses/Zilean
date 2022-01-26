class InvalidStateError extends Error {
  constructor(errors, httpCode, message) {
    super((message || 'Invalid state'));
    this.httpCode = httpCode || 422;
    this.errors = errors;
  }
}

module.exports = InvalidStateError;
