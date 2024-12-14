import jwt from 'jsonwebtoken';

import { JWT_SECRET_KEY, JWT_TOKEN_EXPIRY } from '../../config/serverConfig.js';

export const createJwt = function (payload) {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_TOKEN_EXPIRY
  });
};
