import { ProfileModel, SuspendModel, RoleModel } from '../models/associate';
import { ISuspend } from '../models/suspendModel';
import { IProfileRequest, IProfile } from '../models/profileModel';
import Sequelize from 'sequelize';
import hashPassword from '../utils/hashPassword';

const Op = Sequelize.Op;

const getAllProfilesByRole = async (role: string): Promise<Array<IProfile>> =>
  await ProfileModel.findAll({
    include: [{ model: RoleModel, as: 'role', where: { name: role } }],
  });

const getProfilesByTeam = async (team: string): Promise<Array<IProfile>> =>
  await ProfileModel.findAll({
    where: { team: team },
    include: [{ model: RoleModel, as: 'role' }],
  });

const getProfileById = async (id: string): Promise<IProfile | null> =>
  await ProfileModel.findByPk(id, {
    include: [{ model: RoleModel, as: 'role' }],
  });

const checkActiveProfile = async (id: string): Promise<ISuspend | null> =>
  await SuspendModel.findOne({
    where: {
      profileId: id,
    },
  });

const getProfileByIdAndRole = async (id: string, role: string): Promise<IProfile | null> =>
  await ProfileModel.findOne({
    where: {
      id: id,
    },
    include: [
      { model: RoleModel, as: 'role', where: { name: role } },
      { model: SuspendModel, as: 'suspendTable' },
    ],
  });

const getProfileByLogin = async (login: string): Promise<IProfile | null> =>
  await ProfileModel.findOne({ where: { login: login } });

const getProfileByEmail = async (email: string): Promise<IProfile | null> =>
  await ProfileModel.findOne({ where: { email: email } });

const getProfileByResetToken = async (resetPasswordToken: string): Promise<IProfile | null> =>
  await ProfileModel.findOne({
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
  await ProfileModel.update(
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
  checkActiveProfile,
  getProfileByIdAndRole,
  updateProfileById,
  getProfileByLogin,
  getProfileByEmail,
  getProfileByResetToken,
  getProfilesByTeam,
  kickTeamById,
};
