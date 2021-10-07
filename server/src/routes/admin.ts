import { Router } from 'express';
import {
  banProfile,
  unbanProfile,
  approveManager,
  declineManager,
} from '../controllers/adminController';

import { getProfiles, getProfile } from '../controllers/profilesController';
import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

// Admin
router.route('/manager').get(protect, authorize('admin'), getProfiles);

router.route('/manager/:id').get(protect, authorize('admin'), getProfile);

router.route('/:role/:id/ban').put(protect, authorize('admin'), banProfile);
router.route('/:role/:id/unban').put(protect, authorize('admin'), unbanProfile);

router.route('/manager/:id/approve').put(protect, authorize('admin'), approveManager);
router.route('/manager/:id/decline').put(protect, authorize('admin'), declineManager);

export default router;
