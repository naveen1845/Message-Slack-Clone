import { StatusCodes } from 'http-status-codes';

import { isMemberAlreadyMemberOfWorkspaceService } from '../services/memberService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const isMemberAlreadyMemberOfWorkspaceController = async (req, res) => {
  try {
    const response = await isMemberAlreadyMemberOfWorkspaceService(
      req.params.workspaceId,
      req.user
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'User is a part of the Workspace'));
  } catch (error) {
    console.log('controller error', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};
