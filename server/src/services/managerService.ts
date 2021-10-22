import { ProfileModel } from '../models/associate';
import TeamRequests from '../models/teamRequestsModel';
import { ITeamRequest } from '../models/teamRequestsModel';

const getAllTeamRequests = async (): Promise<Array<ITeamRequest> | null> =>
  await TeamRequests.findAll({ where: { status: 'waiting' } });

// Manager
const approveTeamById = async (team: string, id: string): Promise<void> => {
  await ProfileModel.update(
    {
      team: team,
    },
    {
      where: {
        id: id,
      },
    },
  );

  await TeamRequests.update(
    {
      status: 'approved',
    },
    {
      where: {
        profileId: id,
        status: 'waiting',
      },
    },
  );
};

const declineTeamById = async (id: string): Promise<void> => {
  await TeamRequests.update(
    {
      status: 'declined',
    },
    {
      where: {
        profileId: id,
        status: 'waiting',
      },
    },
  );
};

export { approveTeamById, declineTeamById, getAllTeamRequests };
