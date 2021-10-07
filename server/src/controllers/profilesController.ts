import { Response, Request } from 'express';
import {
  getAllProfilesByRole,
  getProfileById,
  getProfileByIdAndRole,
  updateProfileById,
  getProfilesByTeam,
  kickTeamById,
} from '../services/profileService';

import { IProfile } from '../models/profileModel';

const getProfiles = async (req: Request, res: Response): Promise<void> => {
  const role = req.path.split('/')[1];

  if (!role) {
    res.status(200).json({ message: 'Role not found' });
    return;
  }

  const profiles: IProfile[] = await getAllProfilesByRole(role);

  res.status(200).json(profiles.map((profile) => profile.toResponse()));
};

const getTeam = async (req: Request, res: Response): Promise<void> => {
  const team: string | undefined = req.params.team;

  if (!team) {
    res.status(200).json({ message: 'Team not found' });
    return;
  }

  const profiles: IProfile[] = await getProfilesByTeam(team);

  res.status(200).json(profiles.map((profile) => profile.toResponse()));
};

const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const role = req.path.split('/')[1];

  if (!id) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  if (!role) {
    res.status(200).json({ message: 'Role not found' });
    return;
  }

  const profile: IProfile | null = await getProfileByIdAndRole(id, role);
  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  res.status(200).json(profile.toResponse());
};

const getMe = async (_req: Request, res: Response): Promise<void> => {
  const profile: IProfile | null = res.locals.profile;
  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  res.status(200).json(profile.toResponse());
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { body } = req;
  
  const { id } = res.locals.profile;
  if (!id) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }
  
  let profile: IProfile | null = await getProfileById(id);

  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  await updateProfileById(profile, body);

  profile = await getProfileById(id);

  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }
  

  res.status(200).json(profile.toResponse());
};

const kickTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  const { kickReason } = req.body;
  if (!kickReason) {
    res.status(404).json({ message: 'No reason' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const { team } = profile;
  if (!team) {
    res.status(404).json({ message: 'Player not on any team' });
    return;
  }

  await kickTeamById(id, kickReason);
  res.status(200).json({ message: 'Player kicked' });
};

export { getProfiles, getTeam, getProfile, updateProfile, getMe, kickTeam };
