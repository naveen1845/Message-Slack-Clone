import Channel from '../model/channel.js';
import crudRepository from './crudRepository.js';

export const channelRepository = {
  ...crudRepository(Channel),
  getChannelWithWorkspace: async (channelId) => {
    const response = await Channel.findById(channelId).populate('workspaceId');
    return response;
  }
};
