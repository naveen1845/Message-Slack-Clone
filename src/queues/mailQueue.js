import Queue from 'bull';

import { redisConfig } from '../config/redisConfig.js';

export const mailQueue = new Queue('mailQueue', {
  redis: redisConfig
});
