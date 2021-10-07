import { Response, Request } from 'express';
import { getProfileById } from '../services/profileService';
import { approveTeamById, declineTeamById } from '../services/managerService';

import { IProfile } from '../models/profileModel';

// Manager
const approveTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const { teamRequest, teamStatus } = profile;
  if (teamStatus !== 'waiting') {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  await approveTeamById(teamRequest, id);
  res.status(200).json({ message: 'Application approved' });
};

const declineTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const profile: IProfile | null = await getProfileById(id);
  if (!profile) {
    res.status(404).json({ message: 'Profile not found' });
    return;
  }

  const { teamStatus } = profile;
  if (teamStatus !== 'waiting') {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  await declineTeamById(id);
  res.status(200).json({ message: 'Application declined' });
};

export { approveTeam, declineTeam };
