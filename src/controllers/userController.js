import { StatusCodes } from 'http-status-codes';

import { singUpService } from '../services/userService.js';
import {
  customErrorResponse,
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
