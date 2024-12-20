import { StatusCodes } from 'http-status-codes';

import { channelRepository } from '../repository/channelRespository.js';
import ClientError from '../utils/errors/ClientError.js';
import { isMemberAlreadyMemberOfWorkspace } from './workspaceService.js';

export const getChannelByIdService = async (channelId, userId) => {
  try {
    const channel = await channelRepository.getChannelWithWorkspace(channelId);
    console.log(channel);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        explanation: 'Invalid channel Id',
        message: 'Invalid data sent buy the user',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const isUserMmeberofWorkspace = isMemberAlreadyMemberOfWorkspace(
      channel.workspaceId,
      userId
    );

    if (!isUserMmeberofWorkspace) {
      throw new ClientError({
        explanation:
          'user is not the member of the workspace hense not allowed to access the channel',
        message: 'this user is not the member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return channel;
  } catch (error) {
    console.log('getChannelByIdservice', error);
    throw error;
  }
};
