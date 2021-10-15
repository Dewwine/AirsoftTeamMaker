require('dotenv').config();

import crypto from 'crypto';
import Profiles from '../models/profileModel';
import ManagerRequests from '../models/managerRequestsModel';
import { IProfileRequest, IProfile } from '../models/profileModel';
import { Response } from 'express';
import hashPassword from '../utils/hashPassword';

const createNewProfile = async (body: IProfileRequest): Promise<IProfile> => {
  const password: string = await hashPassword(body.password);

  return await Profiles.create({
    email: body.email,
    login: body.login,
    password: password,
    role: body.role,
    isActive: body.role === 'manager' ? false : true,
  });
};

const sendTokenResponse = (profile: IProfile, statusCode: number, res: Response) => {
  const token: string = profile.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({ message: 'Success', token });
};

const resetCookieResponse = (message: string, statusCode: number, res: Response) => {
  const options = {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', 'none', options).json({ message });
};

const createResetPasswordToken = async (id: string): Promise<string> => {
  const resetToken: string = crypto.randomBytes(20).toString('hex');

  await Profiles.update(
    {
      resetPasswordToken: crypto.createHash('sha256').update(resetToken).digest('hex'),
      resetPasswordExpire: new Date(Date.now() + 10 * 60 * 1000),
    },
    {
      where: {
        id: id,
      },
    },
  );

  return resetToken;
};

const deleteResetPasswordToken = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const createNewPassword = async (id: string, newPassword: string): Promise<void> => {
  await Profiles.update(
    {
      password: await hashPassword(newPassword),
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const requestRegisterById = async (id: string): Promise<void> => {
  await ManagerRequests.create({
    status: 'waiting',
    profileId: id,
  });
};

export {
  createNewProfile,
  sendTokenResponse,
  resetCookieResponse,
  createNewPassword,
  createResetPasswordToken,
  deleteResetPasswordToken,
  requestRegisterById,
};
