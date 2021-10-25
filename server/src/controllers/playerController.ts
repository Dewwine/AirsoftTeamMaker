import { Response, Request } from 'express';

import { getProfilesByTeam } from '../services/profileService';
import {
  getTeamRequestByProfileId,
  requestTeamById,
  cancelTeamById,
  leaveTeamById,
  getTeamByName
} from '../services/playerService';
import { ITeamRequest } from '../models/teamRequestsModel';
import { IProfile } from '../models/profileModel';

// Player
const applyTeam = async (req: Request, res: Response): Promise<void> => {
  const { id, teamId: playerTeam } = res.locals.profile;

  const { team: teamName } = req.params;
  if (!teamName) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  const team = await getTeamByName(teamName);
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }

  if (!['teamA', 'teamB'].includes(team.name)) {
    res.status(404).json({ message: 'Team not exists' });
    return;
  }
  if (playerTeam === team.id) {
    res.status(404).json({ message: 'Already in team' });
    return;
  }

  const playersInTeam: IProfile[] = await getProfilesByTeam(team.id);
  if (playersInTeam.length === 10) {
    res.status(400).json({ message: 'Team is full' });
    return;
  }

  const teamRequest: ITeamRequest | null = await getTeamRequestByProfileId(id);
  if (teamRequest) {
    res.status(404).json({ message: 'You already have active request' });
    return;
  }

  await requestTeamById(team.id, id);

  res.status(200).json({ message: 'Application sent' });
};

const cancelTeam = async (_req: Request, res: Response): Promise<void> => {
  const { id } = res.locals.profile;

  const teamRequest: ITeamRequest | null = await getTeamRequestByProfileId(id);
  if (!teamRequest) {
    res.status(400).json({ message: 'Your application was reviewed by manager' });
    return;
  }

  await cancelTeamById(teamRequest);

  res.status(200).json({ message: 'Application cancelled' });
};

const leaveTeam = async (_req: Request, res: Response): Promise<void> => {
  const { id, team } = res.locals.profile;
  if (!team) {
    res.status(400).json({ message: 'You are not on any team' });
    return;
  }

  const teamRequest: ITeamRequest | null = await getTeamRequestByProfileId(id);
  if (teamRequest) {
    res.status(404).json({ message: 'You already have active request' });
    return;
  }

  await leaveTeamById(id);

  res.status(200).json({ message: 'Application sent' });
};

const getMyTeam = async (_req: Request, res: Response): Promise<void> => {
  const { team } = res.locals.profile;
  if (!team) {
    res.status(400).json({ message: 'You are not on any team' });
    return;
  }

  const profiles: IProfile[] = await getProfilesByTeam(team);

  res.status(200).json(profiles.map((profile) => profile.toResponse()));
};

export { applyTeam, cancelTeam, leaveTeam, getMyTeam };
