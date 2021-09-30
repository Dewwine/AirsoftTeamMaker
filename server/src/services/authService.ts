require('dotenv').config();

import Profiles from "../models/profileModel";
import { IProfileRequest, IProfile } from "../models/profileModel";
import { Response } from 'express';
import hashPassword from '../utils/hashPassword';

const createNewProfile = async (body: IProfileRequest): Promise<IProfile> => {
  const password: string = await hashPassword(body.password);

  return await Profiles.create({
    email: body.email,
    login: body.login,
    password: password,
    role: body.role,
  });
}

const sendTokenResponse = (profile: IProfile, statusCode: number, res: Response) => {
  const token: string = profile.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE as string) * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({token})
  
}

export {
  createNewProfile,
  sendTokenResponse,
}