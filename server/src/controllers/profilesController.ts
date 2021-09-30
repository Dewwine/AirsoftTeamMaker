import { Response, Request } from 'express';
import {
  getAllProfiles,
  getProfileById,
  updateProfileById,
} from '../services/profileService'
import { IProfile } from '../models/profileModel';


const getProfiles = async (_req: Request, res: Response): Promise<void> => {
  const profiles: IProfile[] = await getAllProfiles();
  
  res.status(200).json(profiles.map(profile => profile.toResponse()));
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const profile: IProfile | null = await getProfileById(id);
  
  res.status(200).json(profile?.toResponse());
};

const getMe = async (_req: Request, res: Response): Promise<void> => {
  const profile: IProfile | null = res.locals.profile;

  res.status(200).json(profile?.toResponse());
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;
  const { id } = req.params;

  if (id !== res.locals.profile.id.toString()) {
    res.status(401).json({message: `You have no permission to update this profile`});
    return;
  }

  await updateProfileById(body, id);
  const profile: IProfile | null = await getProfileById(id);

  res.status(200).json(profile?.toResponse());
};

export { getProfiles, getProfile, updateProfile, getMe };
