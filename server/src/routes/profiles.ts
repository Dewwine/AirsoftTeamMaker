import { Router } from 'express';
import {
  banProfile,
  unbanProfile,
  approveManager,
  declineManager,
} from '../controllers/adminController';
import { approveTeam, declineTeam } from '../controllers/managerController';
import { applyTeam, cancelTeam, leaveTeam, getMyTeam } from '../controllers/playerController';

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

// Manager
router.route('/player/:id/approve').put(protect, authorize('manager'), approveTeam);
router.route('/player/:id/decline').put(protect, authorize('manager'), declineTeam);

// Player
router.route('/teams/:team/apply').put(protect, authorize('player'), applyTeam);
router.route('/teams/:team/cancel').get(protect, authorize('player'), cancelTeam);
router.route('/teams/:team/leave').get(protect, authorize('player'), leaveTeam);
router.route('/myteam').get(protect, authorize('player'), getMyTeam);

//
router.route('/player').get(protect, authorize('player', 'manager', 'admin'), getProfiles);
router.route('/player/:id').get(protect, authorize('player', 'manager', 'admin'), getProfile);
router.route('/player/:id/kick').put(protect, authorize('manager', 'admin'), kickTeam);

router
  .route('/me')
  .get(protect, authorize('player', 'manager', 'admin'), getMe)
  .put(protect, authorize('player', 'manager', 'admin'), updateProfile);

// Admin
router.route('/manager').get(protect, authorize('admin'), getProfiles);

router.route('/manager/:id').get(protect, authorize('admin'), getProfile);

router.route('/:role/:id/ban').put(protect, authorize('admin'), banProfile);
router.route('/:role/:id/unban').put(protect, authorize('admin'), unbanProfile);

router.route('/manager/:id/approve').put(protect, authorize('admin'), approveManager);
router.route('/manager/:id/decline').put(protect, authorize('admin'), declineManager);

export default router;
