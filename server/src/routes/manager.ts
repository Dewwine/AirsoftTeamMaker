import { Router } from 'express';
import { approveTeam, declineTeam, getTeamRequests } from '../controllers/managerController';

import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

router.route('/teamRequests').get(protect, authorize(2), getTeamRequests);


router.route('/player/:id/approve').put(protect, authorize(2), approveTeam);
router.route('/player/:id/decline').put(protect, authorize(2), declineTeam);

export default router;
