import Profiles from '../models/profileModel';

// Player
const requestTeamById = async (team: string, id: string): Promise<void> => {
  await Profiles.update(
    {
      teamRequest: team,
      teamStatus: 'waiting',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const cancelTeamById = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      teamRequest: null,
      teamStatus: null,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

const leaveTeamById = async (id: string): Promise<void> => {
  await Profiles.update(
    {
      teamRequest: null,
      teamStatus: 'waiting',
    },
    {
      where: {
        id: id,
      },
    },
  );
};

export { requestTeamById, cancelTeamById, leaveTeamById };
