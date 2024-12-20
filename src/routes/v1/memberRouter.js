import express from 'express';

import { isMemberAlreadyMemberOfWorkspaceController } from '../../controllers/memberController.js';
import { isAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:workspaceId', isAuth, isMemberAlreadyMemberOfWorkspaceController);

export default router;
