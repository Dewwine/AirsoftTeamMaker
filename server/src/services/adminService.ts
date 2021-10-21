import SuspendTable from '../models/suspendModel';
import ManagerRequests from '../models/managerRequestsModel';
import { IManagerRequest } from '../models/managerRequestsModel';

const getAllManagerRequests = async (): Promise<Array<IManagerRequest> | null> =>
  await ManagerRequests.findAll({ where: { status: 'waiting' } });

const getManagerRequestByProfileId = async (id: string): Promise<IManagerRequest | null> =>
  await ManagerRequests.findOne({ where: { profileId: id, status: 'waiting' } });

// Admin
const approveManagerById = async (id: string): Promise<void> => {
  await SuspendTable.update(
    {
      isActive: true,
    },
    {
      where: {
        profileId: id,
      },
    },
  );

  await ManagerRequests.update(
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

const declineManagerById = async (id: string): Promise<void> => {
  await ManagerRequests.update(
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

const BanProfileById = async (id: string, reason: string): Promise<void> => {
  await SuspendTable.update(
    {
      isActive: 'false',
      suspendReason: reason,
    },
    {
      where: {
        profileId: id,
      },
    },
  );
};

const UnbanProfileById = async (id: string, reason: string): Promise<void> => {
  await SuspendTable.update(
    {
      isActive: 'true',
      suspendReason: reason,
    },
    {
      where: {
        profileId: id,
      },
    },
  );
};

export {
  approveManagerById,
  declineManagerById,
  BanProfileById,
  UnbanProfileById,
  getManagerRequestByProfileId,
  getAllManagerRequests,
};
