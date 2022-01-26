class NotFoundError extends Error {
  constructor(message, httpCode, errors) {
    super((message || 'Resource Not Found'));
    this.httpCode = httpCode || 404;
    this.errors = errors;
  }
}

module.exports = NotFoundError;
