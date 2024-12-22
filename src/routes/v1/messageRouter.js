import express from 'express';

import { createMessage, getMessages } from '../../controllers/messageController.js';
import { isAuth } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', isAuth, getMessages);
router.post('/:channelId', isAuth, createMessage);
export default router;
