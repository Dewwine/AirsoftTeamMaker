import { Router } from 'express';
import { approveTeam, declineTeam, getTeamRequests } from '../controllers/managerController';

import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

router.route('/teamRequests').get(protect, authorize('manager'), getTeamRequests);


router.route('/player/:id/approve').put(protect, authorize('manager'), approveTeam);
router.route('/player/:id/decline').put(protect, authorize('manager'), declineTeam);

export default router;
