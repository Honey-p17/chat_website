import { Router } from 'express';
import { crawlAndIndex } from '../controllers/crawlController';

const router = Router();

// Endpoint called after crawler fetches raw HTML
router.post('/', crawlAndIndex);

export default router;
