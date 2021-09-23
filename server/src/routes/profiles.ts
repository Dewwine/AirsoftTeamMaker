import { Router } from 'express';

import { getProfiles, getProfile, createProfile, updateProfile } from '../controllers/profiles.controller';

const router: Router = Router();

router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .get(getProfile)
  .put(updateProfile);

export default router;
