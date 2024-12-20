import '../processors/mailProcessor.js';

import { mailQueue } from '../queues/mailQueue.js';

export const addMailToMailQueue = (mailObject) => {
  try {
    console.log(mailObject);
    mailQueue.add(mailObject);
  } catch (error) {
    console.log('addMailToMailQueue :', error);
  }
};
