import { Router } from 'express';
import { approveTeam, declineTeam } from '../controllers/managerController';

import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

// Manager
router.route('/player/:id/approve').put(protect, authorize('manager'), approveTeam);
router.route('/player/:id/decline').put(protect, authorize('manager'), declineTeam);

export default router;
