import express from 'express';

import channelRouter from './channelRouter.js';
import memberRouter from './memberRouter.js';
import userRouter from './userRouter.js';
import workspaceRouter from './workspace.js';

const router = express.Router();

router.use('/users', userRouter);
router.use('/workspaces', workspaceRouter);
router.use('/channels', channelRouter);
router.use('/member', memberRouter);

export default router;
