import TeamModel, { ITeamResponse } from '../models/teamModel';
import TeamRequests from '../models/teamRequestsModel';
import { ITeamRequest } from '../models/teamRequestsModel';

const getTeamRequestByProfileId = async (id: string): Promise<ITeamRequest | null> =>
  await TeamRequests.findOne({ where: { profileId: id, status: 'waiting' } });

// Player
const requestTeamById = async (teamId: number, id: string): Promise<void> => {
  await TeamRequests.create({
    teamRequest: teamId,
    status: 'waiting',
    profileId: id,
  });
};

const cancelTeamById = async (teamRequest: ITeamRequest): Promise<void> => {
  await teamRequest.destroy();
};

const leaveTeamById = async (id: string): Promise<void> => {
  await TeamRequests.create({
    teamRequest: null,
    status: 'waiting',
    profileId: id,
  });
};

const getTeamByName = async (teamName: string): Promise<ITeamResponse | null> =>
  await TeamModel.findOne({ where: { name: teamName } });

export { requestTeamById, cancelTeamById, leaveTeamById, getTeamRequestByProfileId, getTeamByName };
