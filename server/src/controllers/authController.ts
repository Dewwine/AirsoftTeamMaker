import crypto, { BinaryLike } from 'crypto';
import { Response, Request } from 'express';
import {
  getProfileByLogin,
  getProfileByEmail,
  getProfileByResetToken,
  checkActiveProfile
} from '../services/profileService';
import {
  createNewPassword,
  createNewProfile,
  createSuspendTable,
  sendTokenResponse,
  createResetPasswordToken,
  deleteResetPasswordToken,
  resetCookieResponse,
  requestRegisterById,
  deleteUserProfile,
  verifyGoogleToken,
} from '../services/authService';
import { IProfile, IProfileRequest } from '../models/profileModel';
import { sendEmail } from '../utils/emailSender';
import { getManagerRequestByProfileId } from '../services/adminService';
import { IManagerRequest } from '../models/managerRequestsModel';
import { ISuspend } from '../models/suspendModel';

const register = async (req: Request, res: Response) => {
  const { body } = req;

  const profile: IProfile = await createNewProfile(body);
  
  await createSuspendTable(profile);

  if (profile.roleId === 2) {
    await requestRegisterById(profile.id);
    res.status(202).json({ message: 'Your application was sent' });
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

  const isMatch: boolean = await profile.matchPassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const managerRequest: IManagerRequest | null = await getManagerRequestByProfileId(profile.id);
  if (profile.roleId === 2 && managerRequest) {
    res.status(400).json({ message: 'Your application on review' });
    return;
  }

  const activeProfile: ISuspend | null = await checkActiveProfile(profile.id);
  if (!activeProfile) {
    res.status(403).json({ message: 'Something went wrong' });
    return;
  }

  if (profile.roleId === 2 && !activeProfile.isActive) {
    res.status(400).json({ message: 'Your application was declined' });
    return;
  }

  if (!activeProfile.isActive) {
    res.status(403).json({ message: 'Your account is suspended' });
    return;
  }

  sendTokenResponse(profile, 200, res);
};

const googleAuth = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  const profileData: IProfileRequest | void = await verifyGoogleToken(id_token);
  if (!profileData) {
    res.status(401).json({ message: 'Account not exists' });
    return;
  }

  let profile: IProfile | null = await getProfileByLogin(profileData.login);
  if (!profile) {
    profile = await createNewProfile(profileData);
    await createSuspendTable(profile);
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

  const resetToken: string = await createResetPasswordToken(profile.id);

  const resetMessage: string = `Your password reset url is: ${resetToken}`;

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
  const resetPasswordToken: string = crypto
    .createHash('sha256')
    .update(req.params.resettoken as BinaryLike)
    .digest('hex');

  const profile: IProfile | null = await getProfileByResetToken(resetPasswordToken);
  if (!profile) {
    res.status(400).json({ message: 'Invalid token' });
    return;
  }

  await createNewPassword(profile.id, req.body.password);

  sendTokenResponse(profile, 200, res);
};

const deleteProfile = async (req: Request, res: Response): Promise<void> => {
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

  const isMatch: boolean = await profile.matchPassword(password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  await deleteUserProfile(profile);

  res.status(200).json({ message: 'Profile deleted' });
};

export { register, login, logout, forgotPassword, resetPassword, deleteProfile, googleAuth };
