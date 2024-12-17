import express from 'express';

import {
    addChannelToWorkspace,
    addMemberToWorkspace,
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaceByJoinCode,
  getWorkspacesOfUser,
  updatedWorkspace
} from '../../controllers/workspaceController.js';
import { isAuth } from '../../middlewares/authMiddleware.js';
import { createWorkspaceSchema } from '../../validator/workspaceSchema.js';
import { validator } from '../../validator/zodValidator.js';

const router = express.Router();

router.post('/', isAuth, validator(createWorkspaceSchema), createWorkspace);

router.get('/', isAuth, getWorkspacesOfUser);

router.get('/:workspaceId', isAuth, getWorkspace);

router.get('/join/:joinCode', isAuth, getWorkspaceByJoinCode);

router.put('/:workspaceId', isAuth, updatedWorkspace)

router.put('/:workspaceId/members', isAuth, addMemberToWorkspace)

router.put('/:workspaceId/channels', isAuth, addChannelToWorkspace)

router.delete('/:workspaceId', isAuth, deleteWorkspace);

export default router;
