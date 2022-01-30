// eslint-disable-next-line prefer-destructuring
const ApplicationError = require('./application-error')

class DataValidationError extends ApplicationError {
  constructor(errors, message) {
    const errorsArray = [];

    for (let i = 0; i < errors.length; i += 1) {
      errorsArray[i] = {};
      errorsArray[i].title = 'Data validation error';
      errorsArray[i].detail = errors[i].detail ? errors[i].detail : 'Check input data';
    }
    super(errorsArray, 422, message);
  }
}

module.exports = DataValidationError;
