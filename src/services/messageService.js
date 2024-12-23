import { StatusCodes } from 'http-status-codes';

import { channelRepository } from '../repository/channelRespository.js';
import { messageRepository } from '../repository/messageRepository.js';
import ClientError from '../utils/errors/ClientError.js';
import { isMemberAlreadyMemberOfWorkspace } from './workspaceService.js';

export const getMessagesService = async (channelId, userId, limit, page) => {
  try {
    const channelDetails =
      await channelRepository.getChannelWithWorkspace(channelId);

    const workspace = channelDetails.workspaceId;

    const isMember = isMemberAlreadyMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not the member of this workspace',
        message: 'User is not is the member of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const messages = await messageRepository.getPaginatedMessages(
      channelId,
      limit,
      page
    );

    return messages;
  } catch (error) {
    console.log('getMessagesService : ', error);
    throw error;
  }
};

export const createMessageService = async (messageObject) => {
  try {
    const channelDetails = await channelRepository.getChannelWithWorkspace(
      messageObject.channelId
    );

    const workspaceId = channelDetails.workspaceId._id;
    const workspace = channelDetails.workspaceId;

    const isMember = isMemberAlreadyMemberOfWorkspace(
      workspace,
      messageObject.senderId
    );

    if (!isMember) {
      throw new ClientError({
        explanation: 'User is not the member of this workspace',
        message: 'User is not is the member of this workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const newMessage = await messageRepository.create({
      ...messageObject,
      workspaceId: workspaceId
    });
    return newMessage;
  } catch (error) {
    console.log('createMessageService : ', error);
    throw error;
  }
};
