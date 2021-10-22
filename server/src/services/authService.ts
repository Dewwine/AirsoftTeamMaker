require('dotenv').config();

import crypto from 'crypto';
import { ProfileModel, SuspendModel, RoleModel } from '../models/associate';
import ManagerRequests from '../models/managerRequestsModel';
import { IProfileRequest, IProfile } from '../models/profileModel';
import { ISuspend } from '../models/suspendModel';
import { Response } from 'express';
import hashPassword from '../utils/hashPassword';

import { OAuth2Client } from 'google-auth-library';

const createNewProfile = async (body: IProfileRequest): Promise<IProfile> => {
  const password: string = await hashPassword(body.password);

  const role = await RoleModel.findOne({ where: { name: body.role } });

  return await ProfileModel.create({
    email: body.email,
    login: body.login,
    password: password,
    roleId: role!.id,
  });
};

const createSuspendTable = async (body: IProfile): Promise<ISuspend> => {
  return await SuspendModel.create({
    profileId: body.id,
    isActive: body.roleId === 2 ? false : true,
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

  await ProfileModel.update(
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
  await ProfileModel.update(
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
  await ProfileModel.update(
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

const deleteUserProfile = async (profile: IProfile): Promise<void> => {
  await profile.destroy();
};

const requestRegisterById = async (id: string): Promise<void> => {
  await ManagerRequests.create({
    status: 'waiting',
    profileId: id,
  });
};

const verifyGoogleToken = async (token: string): Promise<IProfileRequest | void> => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    return;
  }

  const profileData: IProfileRequest = {
    email: `${payload.email}`,
    login: `${payload.name}`,
    password: `${payload.given_name}${payload.family_name}`,
    avatar: `${payload.picture}`,
    role: 'player',
  };

  return profileData;
};

export {
  createNewProfile,
  createSuspendTable,
  sendTokenResponse,
  resetCookieResponse,
  createNewPassword,
  createResetPasswordToken,
  deleteResetPasswordToken,
  requestRegisterById,
  deleteUserProfile,
  verifyGoogleToken,
};
