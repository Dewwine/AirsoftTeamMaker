import { Response, Request } from 'express';
import Profile from "../models/profile.model";

const getProfiles = async (_req: Request, res: Response) => {
  const profiles = await Profile.findAll()
  res.status(200).json(profiles);
};

const getProfile = async (req: Request, res: Response) => {
  const profile = await Profile.findByPk(req.params.id)
  res.status(200).json(profile);
};

const createProfile = async (req: Request, res: Response) => {
  const { body } = req;
  const profile = await Profile.create({
    login: body.login,
    password: body.password,
    role: body.role,
    avatar: body.avatar,
    team: body.team,
  })
  
  res.status(200).json(profile);
};

const updateProfile = async (req: Request, res: Response) => {
  const { body } = req;

  await Profile.update({
    login: body.login,
    password: body.password,
    role: body.role,
    avatar: body.avatar,
    team: body.team,
  }, { 
    where: {
      id: req.params.id
    }
  })

  const profile = await Profile.findByPk(req.params.id);

  res.status(200).json(profile);
};

export { getProfiles, getProfile, createProfile, updateProfile };
