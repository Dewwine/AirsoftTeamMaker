import { Router } from 'express';

import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';

const router: Router = Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/logout').get(logout);

router.route('/forgotpassword').post(forgotPassword);

router.route('/resetpassword/:resettoken').put(resetPassword);

export default router;
