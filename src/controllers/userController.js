import { StatusCodes } from 'http-status-codes';

import { singInService, singUpService } from '../services/userService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export async function signUp(req, res) {
  try {
    const user = await singUpService(req.body);
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(user, 'User created Successfully'));
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export async function signIn(req, res) {
  try {
    const user = await singInService(req.body);
    return res
      .status(StatusCodes.OK)
      .json(successResponse(user, 'User Signed in Successfully'));
  } catch (error) {
    console.log('sign in service error :', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
}
