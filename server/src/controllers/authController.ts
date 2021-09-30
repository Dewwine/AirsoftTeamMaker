import crypto, { BinaryLike } from 'crypto';
import { Response, Request } from 'express';
import { getProfileByLogin, getProfileByEmail } from '../services/profileService';
import { createNewProfile, sendTokenResponse } from '../services/authService';
import { IProfile } from '../models/profileModel';
import { sendEmail } from '../utils/emailSender';
import Profiles from '../models/profileModel';
import hashPassword from '../utils/hashPassword';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const register = async (req: Request, res: Response) => {
  const { body } = req;

  const profile: IProfile = await createNewProfile(body);
  
  sendTokenResponse(profile, 200, res);
};


const login = async (req: Request, res: Response): Promise<void> => {
  const { login, password } = req.body;
 
  if (!login || !password) {
    res.status(400).json({message: 'No login or password'});
    return;  
  }
  
  const profile: IProfile | null = await getProfileByLogin(login);

  if (!profile) {
    res.status(401).json({message: 'Invalid login'});
    return;
  }

  const isMatch = await profile.matchPassword(password)

  if (!isMatch) {
    res.status(401).json({message: 'Invalid password'});
    return;
  }
  
  sendTokenResponse(profile, 200, res);
};


const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const profile: IProfile | null = await getProfileByEmail(email);

  if (!profile) {
    res.status(404).json({message: 'No user with such email'});
    return;
  }

  const resetToken = profile.getResetPasswordToken();
  await profile.save();
  
  const resetUrl = `${req.protocol}://${req.get('host')}/api/resetpassword/${resetToken}`;
  const resetMessage = `Your password reset url is: ${resetUrl}`;
  
  try {
    await sendEmail({
      email: profile.email,
      subject: 'Password reset token',
      message: resetMessage,
    })
  } catch (err) {
    console.log(err);
    profile.resetPasswordToken = '';
    profile.resetPasswordExpire = new Date(0);

    await profile.save();
    
    res.status(500).json({message: 'Email could not be sent'});
    return;
  }
  
  res.status(200).json({profile, resetToken});
};


const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken as BinaryLike)
    .digest('hex');
    
  const profile = await Profiles.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { 
        [Op.gt]: Date.now() 
      }
    }
  });  

  if (!profile) {
    res.status(400).json({message: 'Invalid token'});
    return;
  }
  
  profile.password = await hashPassword(req.body.password);
  profile.resetPasswordToken = '';
  profile.resetPasswordExpire = new Date(0);
  await profile.save();

  sendTokenResponse(profile, 200, res);
};

export { register, login, forgotPassword, resetPassword };
