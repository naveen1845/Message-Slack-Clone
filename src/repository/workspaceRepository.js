import { StatusCodes } from 'http-status-codes';

import Workspace from '../model/workspace.js';
import ClientError from '../utils/errors/ClientError.js';
import { channelRepository } from './channelRespository.js';
import crudRepository from './crudRepository.js';
import userRepository from './userRepository.js';

export const workspaceRespository = {
  ...crudRepository(Workspace),
  getWorkspaceById: async function (workspaceId) {
    const response = await Workspace.findById(workspaceId)
      .populate('channels')
      .populate('members.memberId');
    return response;
  },
  addMemberToWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent by the client',
        message: 'Invalid workspace id',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const user = await userRepository.getById(memberId);

    if (!user) {
      throw new ClientError({
        explanation: 'Invalid data sent by the client',
        message: 'Invalid User',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isMemberAlreadyAMember = workspace.members.find((member) => {
      return member.memberId.toString() == memberId;
    });

    if (isMemberAlreadyAMember) {
      throw new ClientError({
        explanation: 'Invalid data sent by the client',
        message: 'User is already a Member',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    workspace.members.push({
      memberId: memberId,
      role: role
    });

    await workspace.save();

    return workspace;
  },

  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from the client',
        message: 'Workspace not found',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isChannelAlreadyPartOfWorkspace = workspace.channels.find(
      (channel) => channel.name === channelName
    );

    if (isChannelAlreadyPartOfWorkspace) {
      throw new ClientError({
        explanation: 'Invalid data sent from client',
        message: 'Channel already part of workspace',
        statusCode: StatusCodes.FORBIDDEN
      });
    }

    const channel = await channelRepository.create({
      name: channelName,
      workspaceId: workspaceId
    });

    workspace.channels.push(channel);
    await workspace.save();

    return workspace;
  },

  fetchAllWorkspaceByMemberId: async function (memberId) {
    const workspaces = await Workspace.find({
      'members.memberId': memberId
    }).populate('members.memberId', 'username email avatar');

    return workspaces;
  },
  findByJoinCode: async function (joinCode) {
    const response = await Workspace.findOne({ joinId: joinCode });
    return response;
  }
};
