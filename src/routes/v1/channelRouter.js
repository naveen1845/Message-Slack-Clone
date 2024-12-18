import express from 'express';

import { getChannelById } from '../../controllers/channelController.js';
import { isAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', isAuth, getChannelById);

export default router;
