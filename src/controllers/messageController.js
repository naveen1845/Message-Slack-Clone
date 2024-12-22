import { StatusCodes } from 'http-status-codes';

import { createMessageService, getMessagesService } from '../services/messageService.js';
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObjects.js';

export const getMessages = async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const page = req.query.page || 1;
    const messages = await getMessagesService(
      req.params.channelId,
      req.user,
      limit,
      page
    );
    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully'));
  } catch (error) {
    console.log('getMessages :', error);
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error));
  }
};

export const createMessage = async (req, res) => {
    try {
        const newMessage = await createMessageService({
            channelId: req.params.channelId,
            senderId: req.user,
            body: req.body.text
        })
        return res
      .status(StatusCodes.OK)
      .json(successResponse(newMessage, 'Messages fetched successfully'));
    } catch (error) {
       console.log('createMessage:' , error);
       if (error.statusCode) {
        return res.status(error.statusCode).json(customErrorResponse(error));
      }
  
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalErrorResponse(error));
    }
}
