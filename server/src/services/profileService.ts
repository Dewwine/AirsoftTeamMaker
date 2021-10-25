import { ProfileModel, SuspendModel, RoleModel, TeamModel } from '../models/associate';
import { ISuspend } from '../models/suspendModel';
import { IProfileRequest, IProfile } from '../models/profileModel';
import KickModel from '../models/kickModel';
import Sequelize from 'sequelize';
import hashPassword from '../utils/hashPassword';

const Op = Sequelize.Op;

const getAllProfilesByRole = async (role: string): Promise<Array<IProfile>> =>
  await ProfileModel.findAll({
    include: [
      { model: RoleModel, as: 'role', where: { name: role } },
      { model: TeamModel, as: 'team' },
    ],
  });

const getProfilesByTeam = async (teamId: number): Promise<Array<IProfile>> =>
  await ProfileModel.findAll({
    where: { teamId: teamId },
    include: [
      { model: RoleModel, as: 'role' },
      { model: TeamModel, as: 'team' },
    ],
  });

const getProfileById = async (id: string): Promise<IProfile | null> =>
  await ProfileModel.findByPk(id, {
    include: [
      { model: RoleModel, as: 'role' },
      { model: TeamModel, as: 'team' },
    ],
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
      { model: TeamModel, as: 'team' },
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

  await profile.save();
};

const updateProfileAvatar = async (profile: IProfile, filepath: string): Promise<void> => {
  if (filepath) {
    profile.avatar = filepath;
  }

  await profile.save();
};

const kickTeamById = async (id: string, reason: string): Promise<void> => {
  await ProfileModel.update(
    {
      teamId: null,
    },
    {
      where: {
        id: id,
      },
    },
  );

  await KickModel.update(
    {
      isActive: false,
      kickReason: reason,
    },
    {
      where: {
        profileId: id,
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
  updateProfileAvatar,
  getProfileByLogin,
  getProfileByEmail,
  getProfileByResetToken,
  getProfilesByTeam,
  kickTeamById,
};
