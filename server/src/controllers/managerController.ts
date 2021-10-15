import { Response, Request } from 'express';
import { getProfileById } from '../services/profileService';
import { approveTeamById, declineTeamById, getAllTeamRequests } from '../services/managerService';
import { getTeamRequestByProfileId } from '../services/playerService';

import { IProfile } from '../models/profileModel';
import { ITeamRequest } from '../models/teamRequestsModel';

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

  const teamApplication: ITeamRequest | null = await getTeamRequestByProfileId(id);
  if (!teamApplication) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  const { teamRequest } = teamApplication;

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

  const teamApplication: ITeamRequest | null = await getTeamRequestByProfileId(id);
  if (!teamApplication) {
    res.status(404).json({ message: 'Application not found' });
    return;
  }

  await declineTeamById(id);
  res.status(200).json({ message: 'Application declined' });
};

const getTeamRequests = async (_req: Request, res: Response) => {
  const teamApplications: Array<ITeamRequest> | null = await getAllTeamRequests();
  if (!teamApplications) {
    res.status(404).json({ message: 'Applications not found' });
    return;
  }

  res.status(200).json(teamApplications);
}

export { approveTeam, declineTeam, getTeamRequests };
