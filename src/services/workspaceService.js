import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import { channelRepository } from '../repository/channelRespository.js';
import { workspaceRespository } from '../repository/workspaceRepository.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/ValidationError.js';

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 6).toUpperCase();
    const response = await workspaceRespository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode: joinCode
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

export const getWorkspacesOfUserService = async (userId) => {
    try {
        const response = await workspaceRespository.fetchAllWorkspaceByMemberId(userId)
        return response;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
