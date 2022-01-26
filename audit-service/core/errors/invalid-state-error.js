// eslint-disable-next-line prefer-destructuring
const ApplicationError = require('./application-error');

class InvalidStateError extends ApplicationError {
  constructor(errors) {
    const errorsArray = [];
    errorsArray[0] = {};
    errorsArray[0].title = errors.title ? errors.title : 'Invalid State Error';
    errorsArray[0].detail = errors.detail ? errors.detail : 'Invalid State Error';

    super(errorsArray, 200, 'Invalid State Error');
  }
}

module.exports = InvalidStateError;
