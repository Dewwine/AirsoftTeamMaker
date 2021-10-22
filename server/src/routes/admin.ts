import { Router } from 'express';
import {
  banProfile,
  unbanProfile,
  approveManager,
  declineManager,
  getManagerRequests,
} from '../controllers/adminController';

import { getProfiles, getProfile } from '../controllers/profilesController';
import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

router.route('/managerRequests').get(protect, authorize(1), getManagerRequests);


router.route('/manager').get(protect, authorize(1), getProfiles);

router.route('/manager/:id').get(protect, authorize(1), getProfile);

router.route('/:role/:id/ban').put(protect, authorize(1), banProfile);
router.route('/:role/:id/unban').put(protect, authorize(1), unbanProfile);

router.route('/manager/:id/approve').put(protect, authorize(1), approveManager);
router.route('/manager/:id/decline').put(protect, authorize(1), declineManager);

export default router;
