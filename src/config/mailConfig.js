import nodemailer from 'nodemailer';

import { APP_PASSWORD, MAIL_ID } from './serverConfig.js';

export const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: APP_PASSWORD
  }
});
