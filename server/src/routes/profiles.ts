import { Router } from 'express';

import {
  getProfiles,
  getProfile,
  updateProfile,
  getMe,
  getTeam,
  kickTeam,
} from '../controllers/profilesController';
import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

router.route('/teams/:team').get(protect, authorize(3, 2, 1), getTeam);

router.route('/player').get(protect, authorize(3, 2, 1), getProfiles);
router.route('/player/:id').get(protect, authorize(3, 2, 1), getProfile);
router.route('/player/:id/kick').put(protect, authorize(2, 1), kickTeam);

router
  .route('/me')
  .get(protect, authorize(3, 2, 1), getMe)
  .put(protect, authorize(3, 2, 1), updateProfile);

export default router;
