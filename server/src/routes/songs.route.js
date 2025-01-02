import { Router } from 'express';
import { protectRoute, requireAdmin } from '../middleware/auth.middleware.js';
import { getAllSongs, getFeaturedSongs, getmadeForYouSongs, getTrendingSongs } from '../controllers/song.controller.js';

const router = Router ();

router.get('/', protectRoute, requireAdmin, getAllSongs);
router.get('/featured', getFeaturedSongs);
router.get('/made-for-you', getmadeForYouSongs);
router.get('/trending', getTrendingSongs);

export default router;