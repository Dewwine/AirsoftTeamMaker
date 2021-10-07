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

router.route('/teams/:team').get(protect, authorize('player', 'manager', 'admin'), getTeam);

//
router.route('/player').get(protect, authorize('player', 'manager', 'admin'), getProfiles);
router.route('/player/:id').get(protect, authorize('player', 'manager', 'admin'), getProfile);
router.route('/player/:id/kick').put(protect, authorize('manager', 'admin'), kickTeam);

router
  .route('/me')
  .get(protect, authorize('player', 'manager', 'admin'), getMe)
  .put(protect, authorize('player', 'manager', 'admin'), updateProfile);

export default router;
