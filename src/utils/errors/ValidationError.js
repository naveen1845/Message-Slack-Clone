import { StatusCodes } from 'http-status-codes';

class ValidationError extends Error {
  constructor(errorDetails, message) {
    super(message);
    let explanation = [];
    Object.keys(errorDetails.error).forEach((key) => {
      explanation.push(errorDetails.error[key]);
    });
    this.name = 'ValidationError';
    this.explanation = explanation;
    this.message = message;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default ValidationError;
