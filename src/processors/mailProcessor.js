import { transporter } from '../config/mailConfig.js';
import { mailQueue } from '../queues/mailQueue.js';

mailQueue.process(async (job) => {
  const mailObject = job.data;

  try {
    const response = await transporter.sendMail(mailObject);
    return response;
  } catch (error) {
    console.log('mailQueueProccessor:', error);
  }
});
