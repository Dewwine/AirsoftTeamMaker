import { ProfileModel } from '../models/associate';
import KickModel from '../models/kickModel';
import { IKick } from '../models/kickModel';
import { IProfile } from '../models/profileModel';
import TeamRequests from '../models/teamRequestsModel';
import { ITeamRequest } from '../models/teamRequestsModel';

const getAllTeamRequests = async (): Promise<Array<ITeamRequest> | null> =>
  await TeamRequests.findAll({ where: { status: 'waiting' } });

// Manager
const approveTeamById = async (teamId: number, id: string): Promise<void> => {
  await ProfileModel.update(
    {
      teamId: teamId,
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

  await KickModel.update(
    {
      isActive: true,
      kickReason: null,
    },
    {
      where: {
        profileId: id,
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

const createKickTable = async (body: IProfile): Promise<IKick> => {
  return await KickModel.create({
    profileId: body.id,
    isActive: body.teamId !== null ? false : true,
  });
};

const getKickTable = async (id: string): Promise<IKick | null> => {
  return await KickModel.findOne({
    where: {
      profileId: id,
    },
  });
};

export { approveTeamById, declineTeamById, getAllTeamRequests, createKickTable, getKickTable };
