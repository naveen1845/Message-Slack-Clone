import Message from '../model/message.js';
import crudRepository from './crudRepository.js';

export const messageRepository = {
  ...crudRepository(Message),
  getPaginatedMessages: async function (channelId, limit, page) {
    let offset = (page - 1) * limit;
    const messages = await Message.find({ channelId })
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .populate('workspaceId');
    return messages;
  }
};
