import Channel from '../model/channel.js';
import crudRepository from './crudRepository.js';

export const channelRepository = {
  ...crudRepository(Channel)
};
