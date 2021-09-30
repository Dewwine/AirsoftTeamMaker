import Profiles from "../models/profileModel";
import { IProfileRequest, IProfile } from "../models/profileModel";

const getAllProfiles = async (): Promise<Array<IProfile>> => await Profiles.findAll();

const getProfileById = async (id: string | undefined): Promise<IProfile | null> => await Profiles.findByPk(id);

const getProfileByLogin = async (login: string | undefined): Promise<IProfile | null> => await Profiles.findOne({where: {login: login}});

const getProfileByEmail = async (email: string | undefined): Promise<IProfile | null> => await Profiles.findOne({where: {email: email}});

const updateProfileById = async (body: IProfileRequest, id: string | undefined): Promise<void> => {
  await Profiles.update({
    login: body.login,
    password: body.password,
    avatar: body.avatar,
  }, { 
    where: {
      id: id
    }
  })
};

export {
  getAllProfiles,
  getProfileById,
  updateProfileById,
  getProfileByLogin,
  getProfileByEmail,
}