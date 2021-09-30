import { Router } from 'express';

import { getProfiles, getProfile, updateProfile, getMe } from '../controllers/profilesController';
import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

router.route('/')
  .get(protect, authorize('player', 'manager', 'admin'), getProfiles)

router.route('/me')
  .get(protect, authorize('player', 'manager', 'admin'), getMe)

router.route('/:id')
  .get(protect, authorize('player', 'manager', 'admin'), getProfile)
  .put(protect, authorize('player', 'manager', 'admin'), updateProfile);

export default router;
