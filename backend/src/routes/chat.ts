import { Router } from 'express';
import { handleChatRequest } from '../controllers/chatController';

const router = Router();

router.post('/', handleChatRequest);

export default router;
