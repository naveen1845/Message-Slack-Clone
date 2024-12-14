import express from 'express';

import { signIn, signUp } from '../../controllers/userController.js';
import {
  userSinginSchema,
  userSingupSchema
} from '../../validator/userSchema.js';
import { validator } from '../../validator/zodValidator.js';

const router = express.Router();

router.post('/signup', validator(userSingupSchema), signUp);

router.post('/signin', validator(userSinginSchema), signIn);

export default router;
