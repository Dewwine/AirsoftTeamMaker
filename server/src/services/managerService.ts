import Profiles from '../models/profileModel';

// Manager
const approveTeamById = async (team: string, id: string): Promise<void> => {
  await Profiles.update(
    {
      team: team,
      teamRequest: null,
      teamStatus: 'approved',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const declineTeamById = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      teamRequest: null,
      teamStatus: 'declined',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

export { approveTeamById, declineTeamById };
