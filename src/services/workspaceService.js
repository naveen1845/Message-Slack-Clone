import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { addMailToMailQueue } from '../producers/mailProducer.js';
import { channelRepository } from '../repository/channelRespository.js';
import userRepository from '../repository/userRepository.js';
import { workspaceRespository } from '../repository/workspaceRepository.js';
import { mailObject } from '../utils/common/mailObject.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/ValidationError.js';

const isUserAdmin = function (workspace, userId) {
  return workspace.members.find((member) => {
    const memberId = member.memberId._id || member.memberId; // Handle both populated and plain ObjectId
    return memberId.toString() == userId && member.role == 'admin';
  });
};

export const isMemberAlreadyMemberOfWorkspace = function (workspace, memberId) {
  return workspace.members.find((member) => {
    return (
      member.memberId.toString() == memberId ||
      member.memberId._id.toString() == memberId
    );
  });
};

const isChannelAlreadyPartOfWorkspace = function (workspace, channelName) {
  return workspace.channels.find((channel) => {
    return channel.name.toUpperCase() == channelName.toUpperCase();
  });
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRespository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinId: joinCode
    });

    await workspaceRespository.addMemberToWorkspace(
      response._id,
      workspaceData.owner,
      'admin'
    );

    const updatedWorkspace = await workspaceRespository.addChannelToWorkspace(
      response._id,
      'general'
    );

    return updatedWorkspace;
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
      throw new ValidationError(
        {
          error: ['Workspace with same name already Exists']
        },
        'Workspace with same name already Exist'
      );
    }
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRespository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserAdmin = workspace.members.find((member) => {
      return member.memberId.toString() == userId && member.role === 'admin';
    });

    if (isUserAdmin) {
      // delete the corresponding channels belonging to this workspace as well
      // we can give the channel schema a workspace field, we can delete all the channels with that workspaceId or
      // we can pass the array of channelIds and delete all the channels with ids present in the array
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRespository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      explanation: 'User is either not a member or admin of the workspace',
      message: 'User is not allowed to delete this workspace',
      statusCode: StatusCodes.NOT_FOUND
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const joinWorkspaceService = async (workspaceId, joinId, userId) => {
  try {
    const workspace = await workspaceRespository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    if (workspace.joinId !== joinId) {
      throw new ClientError({
        explanation: 'Invalid JoinId',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const updatedWorkspace = await workspaceRespository.addMemberToWorkspace(
      workspaceId,
      userId,
      'member'
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('joinWorkspaceService : ', error);
    throw error;
  }
};

export const getWorkspacesOfUserService = async (userId) => {
  try {
    const response =
      await workspaceRespository.fetchAllWorkspaceByMemberId(userId);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getWorkspacesByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace = await workspaceRespository.findByJoinCode(joinCode);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const ismemberOfWorkspace = isMemberAlreadyMemberOfWorkspace(
      workspace,
      userId
    );

    if (!ismemberOfWorkspace) {
      throw new ClientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log('find by join code service', error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRespository.getWorkspaceById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const ismemberOfWorkspace = isMemberAlreadyMemberOfWorkspace(
      workspace,
      userId
    );

    if (!ismemberOfWorkspace) {
      throw new ClientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    return workspace;
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRespository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }
    const isUserAdminofWorkspace = isUserAdmin(workspace, userId);

    if (!isUserAdminofWorkspace) {
      throw new ClientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const updatedWorkspace = workspaceRespository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log('updateWorkspaceService : ', error);
    throw error;
  }
};

export const resetJoinIdService = async (workspaceId, userId) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      {
        joinId: joinCode
      },
      userId
    );

    return updatedWorkspace;
  } catch (error) {
    console.log('resetJoinIdService:', error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  role,
  userId
) => {
  try {
    const workspace = await workspaceRespository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserAdminofWorkspace = isUserAdmin(workspace, userId);

    if (!isUserAdminofWorkspace) {
      throw new ClientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const isValidUser = await userRepository.getById(memberId);

    console.log(isValidUser);

    if (!isValidUser) {
      throw new ClientError({
        explanation: 'Member You are tring to add is not Valid',
        message: 'Member You are tring to add is not Valid',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const isMemberAlreadyMember = isMemberAlreadyMemberOfWorkspace(
      workspace,
      memberId
    );

    if (isMemberAlreadyMember) {
      throw new ClientError({
        explanation: 'This User is already a part of the workspace',
        message: 'This user is already a part of the workspace',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const newMember = workspaceRespository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );

    addMailToMailQueue({
      ...mailObject(workspace.name),
      to: isValidUser.email
    });

    return newMember;
  } catch (error) {
    console.log('addMemberToWorkspaceService : ', error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  channelName,
  userId
) => {
  try {
    const workspace = await workspaceRespository.getWorkspaceById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        explanation: 'Invalid Workspace Id',
        message: 'Invalid details given by the user',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserAdminofWorkspace = isUserAdmin(workspace, userId);

    if (!isUserAdminofWorkspace) {
      throw new ClientError({
        explanation: 'User is not the admin of the workspace',
        message: 'User is not the admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    console.log(workspace.channels[0]);
    console.log(workspace.members[0]);

    const isChannelAlreadyPresent = isChannelAlreadyPartOfWorkspace(
      workspace,
      channelName
    );

    if (isChannelAlreadyPresent) {
      throw new ClientError({
        explanation: 'Channel with this name is already present',
        message: 'Channel with this name is already present',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    const newChannel = await workspaceRespository.addChannelToWorkspace(
      workspaceId,
      channelName
    );
    return newChannel;
  } catch (error) {
    console.log('addChannelToWorkspaceService: ', error);
    throw error;
  }
};
