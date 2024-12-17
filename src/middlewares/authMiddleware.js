import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY } from '../config/serverConfig.js';
import userRepository from '../repository/userRepository.js';
import { customErrorResponse } from '../utils/common/responseObjects.js';
export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: 'No auth Token Provided'
        })
      );
    }

    const response = jwt.verify(token, JWT_SECRET_KEY);

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: 'Invalid Auth Token',
          explanation: 'Invalid Data sent by the user'
        })
      );
    }

    const user = await userRepository.getById(response.id);

    req.user = user._id;

    next();
  } catch (error) {
    if (error.name == 'JsonWebTokenError') {
        return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
            explanation : 'Invalid token Signature',
            message: 'invalid token given'
        }))
    }
  }
};
