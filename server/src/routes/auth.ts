import { Router } from 'express';

import { register, login, forgotPassword, resetPassword } from '../controllers/authController';

const router: Router = Router();

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

router.route('/forgotpassword')
  .post(forgotPassword)

router.route('/resetpassword/:resettoken')
  .post(resetPassword)


export default router;
