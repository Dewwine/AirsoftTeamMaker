import crypto, { BinaryLike } from 'crypto';
import { Response, Request } from 'express';
import {
  getProfileByLogin,
  getProfileByEmail,
  getProfileByResetToken,
} from '../services/profileService';
import {
  createNewPassword,
  createNewProfile,
  sendTokenResponse,
  createResetPasswordToken,
  deleteResetPasswordToken,
  resetCookieResponse,
} from '../services/authService';
import { IProfile } from '../models/profileModel';
import { sendEmail } from '../utils/emailSender';

const register = async (req: Request, res: Response) => {
  const { body } = req;

  const profile: IProfile = await createNewProfile(body);
  if (profile.role === 'manager' && profile.managerStatus !== 'approved') {
    res.status(400).json({ message: 'Your application on review' });
    return;
  }

  sendTokenResponse(profile, 200, res);
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { login: profileLogin, password } = req.body;

  if (!profileLogin || !password) {
    res.status(400).json({ message: 'No login or password' });
    return;
  }

  const profile: IProfile | null = await getProfileByLogin(profileLogin);
  if (!profile) {
    res.status(401).json({ message: 'Invalid login' });
    return;
  }

  const isMatch = await profile.matchPassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  if (profile.role === 'manager' && profile.managerStatus !== 'approved') {
    res.status(400).json({ message: 'Your application on review' });
    return;
  }
  
  sendTokenResponse(profile, 200, res);
};

const logout = async (_req: Request, res: Response): Promise<void> => {
  resetCookieResponse('You have been logged out', 200, res);
};

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const profile: IProfile | null = await getProfileByEmail(email);
  if (!profile) {
    res.status(404).json({ message: 'No user with such email' });
    return;
  }

  const resetToken = await createResetPasswordToken(profile.id);

  const resetMessage = `Your password reset url is: ${resetToken}`;

  try {
    await sendEmail({
      email: profile.email,
      subject: 'Password reset token',
      message: resetMessage,
    });
  } catch (err) {
    await deleteResetPasswordToken(profile.id);

    res.status(500).json({ message: 'Email could not be sent' });
    return;
  }

  res.status(200).json({ message: 'Reset token was sent on your email' });
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken as BinaryLike)
    .digest('hex');

  const profile = await getProfileByResetToken(resetPasswordToken);
  if (!profile) {
    res.status(400).json({ message: 'Invalid token' });
    return;
  }

  await createNewPassword(profile.id, req.body.password);

  sendTokenResponse(profile, 200, res);
};

export { register, login, logout, forgotPassword, resetPassword };
