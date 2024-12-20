import { StatusCodes } from 'http-status-codes';

import userRepository from '../repository/userRepository.js';
import { workspaceRespository } from '../repository/workspaceRepository.js';
import ClientError from '../utils/errors/ClientError.js';
import { isMemberAlreadyMemberOfWorkspace } from './workspaceService.js';

export const isMemberAlreadyMemberOfWorkspaceService = async (
  workspaceId,
  memberId
) => {
  try {
    const workspace = await workspaceRespository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMember = isMemberAlreadyMemberOfWorkspace(workspace, memberId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const user = userRepository.getById(memberId);
    return user;
  } catch (error) {
    console.log('isMemberAlreadyMemberOfWorkspaceService: ', error);
    throw error;
  }
};
