import Profiles from '../models/profileModel';
import { IProfileRequest, IProfile } from '../models/profileModel';
import Sequelize from 'sequelize';
import hashPassword from '../utils/hashPassword';

const Op = Sequelize.Op;

const getAllProfilesByRole = async (role: string): Promise<Array<IProfile>> =>
  await Profiles.findAll({ where: { role: role } });

const getProfilesByTeam = async (team: string): Promise<Array<IProfile>> =>
  await Profiles.findAll({ where: { team: team } });

const getProfileById = async (id: string): Promise<IProfile | null> =>
  await Profiles.findByPk(id);

const getProfileByIdAndRole = async (
  id: string,
  role: string,
): Promise<IProfile | null> =>
  await Profiles.findOne({
    where: {
      id: id,
      role: role,
    },
  });

const getProfileByLogin = async (login: string): Promise<IProfile | null> =>
  await Profiles.findOne({ where: { login: login } });

const getProfileByEmail = async (email: string): Promise<IProfile | null> =>
  await Profiles.findOne({ where: { email: email } });

const getProfileByResetToken = async (
  resetPasswordToken: string,
): Promise<IProfile | null> =>
  await Profiles.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: {
        [Op.gt]: Date.now(),
      },
    },
  });

const updateProfileById = async (profile: IProfile, body: IProfileRequest): Promise<void> => {
  if (body.login) {
    profile.login = body.login;
  }
  if (body.password) {
    profile.password = await hashPassword(body.password);
  }
  if (body.avatar) {
    profile.avatar = body.avatar;
  }

  await profile.save();
};

const kickTeamById = async (id: string, reason: string): Promise<void> => {
  await Profiles.update(
    {
      team: null,
      teamStatus: 'kicked',
      kickReason: reason,
    },
    {
      where: {
        id: id,
      },
    },
  );
};

export {
  getAllProfilesByRole,
  getProfileById,
  getProfileByIdAndRole,
  updateProfileById,
  getProfileByLogin,
  getProfileByEmail,
  getProfileByResetToken,
  getProfilesByTeam,
  kickTeamById,
};
