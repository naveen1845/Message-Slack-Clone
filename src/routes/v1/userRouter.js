import express from 'express';

import { signUp } from '../../controllers/userController.js';
import { userSchema } from '../../validator/userSchema.js';
import { validator } from '../../validator/zodValidator.js';

const router = express.Router();

router.post('/', validator(userSchema), signUp);

export default router;
