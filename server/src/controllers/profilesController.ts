import { Response, Request } from 'express';
import {
  getAllProfilesByRole,
  getProfileById,
  getProfileByIdAndRole,
  updateProfileById,
  updateProfileAvatar,
  getProfilesByTeam,
  kickTeamById,
  checkActiveProfile,
} from '../services/profileService';

import { IProfile, IProfileResponse } from '../models/profileModel';
import { getTeamByName } from '../services/playerService';

const getProfiles = async (req: Request, res: Response): Promise<void> => {
  const role = req.path.split('/')[1];

  if (!role) {
    res.status(404).json({ message: 'Role not found' });
    return;
  }

  const profiles: IProfile[] = await getAllProfilesByRole(role);
  if (!profiles) {
    res.status(200).json({ message: 'Something went wrong' });
    return;
  }

  const returnedProfiles: IProfileResponse[] = profiles.map((profile) =>
    Object.assign(profile.toResponse(), {
      role: profile.getDataValue('role'),
      team: profile.getDataValue('team'),
    }),
  );

  res.status(200).json(returnedProfiles);
};

const getTeam = async (req: Request, res: Response): Promise<void> => {
  const { team: teamName } = req.params;

  if (!teamName) {
    res.status(200).json({ message: 'Team not found' });
    return;
  }

  const team = await getTeamByName(teamName);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const profiles: IProfile[] = await getProfilesByTeam(team.id);

  const returnedProfiles: IProfileResponse[] = profiles.map((profile) =>
    Object.assign(profile.toResponse(), {
      role: profile.getDataValue('role'),
      team: profile.getDataValue('team'),
    }),
  );

  res.status(200).json(returnedProfiles);
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

  const suspendInfo = await checkActiveProfile(profile.id);
  if (!suspendInfo) {
    res.status(200).json({ message: 'Something went wrong' });
    return;
  }

  const returnedProfile: IProfileResponse = Object.assign(profile.toResponse(), {
    isActive: suspendInfo.getDataValue('isActive'),
    role: profile.getDataValue('role'),
    team: profile.getDataValue('team'),
  });

  res.status(200).json(returnedProfile);
};

const getMe = async (_req: Request, res: Response): Promise<void> => {
  const profile: IProfile | null = res.locals.profile;

  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  const returnedProfile: IProfileResponse = Object.assign(profile.toResponse(), {
    role: profile.getDataValue('role'),
    team: profile.getDataValue('team'),
  });

  res.status(200).json(returnedProfile);
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

const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  const { file } = req;

  if (!file) {
    res.status(200).json({ message: 'File not found' });
    return;
  }

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

  await updateProfileAvatar(profile, file.path);

  profile = await getProfileById(id);

  if (!profile) {
    res.status(200).json({ message: 'Profile not found' });
    return;
  }

  res.status(200).json({ message: 'Avatar updated' });
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

  const { teamId } = profile;
  if (!teamId) {
    res.status(404).json({ message: 'Player not on any team' });
    return;
  }

  await kickTeamById(id, kickReason);
  res.status(200).json({ message: 'Player kicked' });
};

export { getProfiles, getTeam, getProfile, updateProfile, updateAvatar, getMe, kickTeam };
