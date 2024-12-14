import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import userRepository from '../repository/userRepository.js';
import { createJwt } from '../utils/common/authUtils.js';
import ClientError from '../utils/errors/ClientError.js';
import ValidationError from '../utils/errors/ValidationError.js';

export const singUpService = async function (data) {
  try {
    const user = await userRepository.create(data);
    return user;
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
          error: ['User with same email or Username already exists']
        },
        'User with same email or Username already exists'
      );
    }
  }
};

export const singInService = async function (data) {
  const user = await userRepository.getUserByEmail(data.email);
  if (!user) {
    throw new ClientError({
      explanation: 'Invalid data sent by the client',
      message: 'User with this email does not exist',
      statusCode: StatusCodes.NOT_FOUND
    });
  }

  const isValidPassword = bcrypt.compareSync(data.password, user.password);

  if (!isValidPassword) {
    throw new ClientError({
      explanation: 'Invalid data sent by the client',
      message: 'Incorrect Passeword, Please try again',
      statusCode: StatusCodes.BAD_REQUEST
    });
  }

  return {
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    token: createJwt({ id: user._id, email: user.email })
  };
};
