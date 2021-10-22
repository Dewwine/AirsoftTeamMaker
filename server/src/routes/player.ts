import { Router } from 'express';
import { applyTeam, cancelTeam, leaveTeam, getMyTeam } from '../controllers/playerController';

import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

// Player
router.route('/teams/:team/apply').post(protect, authorize(3), applyTeam);
router.route('/teams/:team/cancel').delete(protect, authorize(3), cancelTeam);
router.route('/teams/:team/leave').get(protect, authorize(3), leaveTeam);
router.route('/myteam').get(protect, authorize(3), getMyTeam);

export default router;
