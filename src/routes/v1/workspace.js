import express from 'express';

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspacesOfUser
} from '../../controllers/workspaceController.js';
import { isAuth } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validator/workspaceSchema.js';
import { validator } from '../../validator/zodValidator.js';

const router = express.Router();

router.post('/', isAuth, validator(createWorkspaceSchema), createWorkspace);

router.get('/', isAuth, getWorkspacesOfUser);

router.delete('/:workspaceId', isAuth, deleteWorkspace);

export default router;
