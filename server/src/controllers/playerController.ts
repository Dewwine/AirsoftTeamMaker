import { Response, Request } from 'express';

import { getProfilesByTeam } from '../services/profileService';
import { requestTeamById, cancelTeamById, leaveTeamById } from '../services/playerService';

// Player
const applyTeam = async (req: Request, res: Response): Promise<void> => {
  const { id, team: playerTeam } = res.locals.profile;
  
  const { team } = req.params;
  if (!team) {
    res.status(404).json({ message: 'Team not found' });
    return;
  }
  if (!['teamA', 'teamB'].includes(team)) {
    res.status(404).json({ message: 'Team not exists' });
    return;
  }
  if (playerTeam === team) {
    res.status(404).json({ message: 'Already in team' });
    return;
  }

  const playersInTeam = await getProfilesByTeam(team);
  if (playersInTeam.length === 10) {
    res.status(400).json({ message: 'Team is full' });
    return;
  }

  await requestTeamById(team, id);

  res.status(200).json({ message: 'Application sent' });
};

const cancelTeam = async (_req: Request, res: Response): Promise<void> => {
  const { id, teamStatus } = res.locals.profile;
  if (teamStatus !== 'waiting') {
    res.status(400).json({ message: 'Your application was reviewed by manager' });
    return;
  }

  await cancelTeamById(id);

  res.status(200).json({ message: 'Application cancelled' });
};

const leaveTeam = async (_req: Request, res: Response): Promise<void> => {
  const { id, team } = res.locals.profile;
  if (!team) {
    res.status(400).json({ message: 'You are not on any team' });
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

  const profiles = await getProfilesByTeam(team);

  res.status(200).json(profiles.map((profile) => profile.toResponse()));
};

export { applyTeam, cancelTeam, leaveTeam, getMyTeam };
