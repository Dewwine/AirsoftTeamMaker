import Profiles from '../models/profileModel';

// Admin
const approveManagerById = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      managerStatus: 'approved',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const declineManagerById = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      managerStatus: 'declined',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const BanProfileById = async (id: string, reason: string): Promise<void> => {
  await Profiles.update(
    {
      isSuspended: 'true',
      suspendReason: reason,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const UnbanProfileById = async (id: string, reason: string): Promise<void> => {
  await Profiles.update(
    {
      isSuspended: 'false',
      suspendReason: reason,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

export { approveManagerById, declineManagerById, BanProfileById, UnbanProfileById };
