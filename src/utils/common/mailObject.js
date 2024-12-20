import { MAIL_ID } from '../../config/serverConfig.js';

export const mailObject = (workspaceName) => {
  return {
    from: MAIL_ID,
    subject: 'You have been added to a workspace',
    text: `Glad to have you as a member of ${workspaceName} workspace`
  };
};
