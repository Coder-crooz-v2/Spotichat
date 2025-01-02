import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

const router = Router ();

router.post('/callback', authController);

export default router;