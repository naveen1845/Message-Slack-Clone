import { StatusCodes } from 'http-status-codes';

import { customErrorResponse } from '../utils/common/responseObjects.js';

export const validator = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      let explanation = [];
      let message = '';
      error.errors.forEach((key) => {
        explanation.push(key.path[0] + ' ' + key.message);
        message += ' : ' + key.path[0] + ' ' + key.message;
      });
      res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation error' + message,
          explanation: explanation
        })
      );
    }
  };
};
