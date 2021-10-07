import { Router } from 'express';
import { applyTeam, cancelTeam, leaveTeam, getMyTeam } from '../controllers/playerController';

import { protect, authorize } from '../middlewares/auth';

const router: Router = Router();

// Player
router.route('/teams/:team/apply').put(protect, authorize('player'), applyTeam);
router.route('/teams/:team/cancel').get(protect, authorize('player'), cancelTeam);
router.route('/teams/:team/leave').get(protect, authorize('player'), leaveTeam);
router.route('/myteam').get(protect, authorize('player'), getMyTeam);

export default router;
