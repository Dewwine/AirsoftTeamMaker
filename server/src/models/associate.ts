import ProfileModel from './profileModel';
import RoleModel from './roleModel';
import TeamModel from './teamModel';
import KickModel from './kickModel';
import SuspendModel from './suspendModel';
import sequelize from '../db/postgresdb';


ProfileModel.belongsTo(TeamModel);
TeamModel.hasMany(ProfileModel);


KickModel.belongsTo(ProfileModel);
ProfileModel.hasOne(KickModel);


SuspendModel.belongsTo(ProfileModel);
ProfileModel.hasOne(SuspendModel);


ProfileModel.belongsTo(RoleModel);
RoleModel.hasMany(ProfileModel);

const initialRoles = () => {
  RoleModel.create({
    id: 1,
    name: 'admin',
  });
  RoleModel.create({
    id: 2,
    name: 'manager',
  });
  RoleModel.create({
    id: 3,
    name: 'player',
  });
};

const initialTeams = () => {
  TeamModel.create({
    id: 1,
    name: 'teamA',
  });
  TeamModel.create({
    id: 2,
    name: 'teamB',
  });
};

sequelize.sync({ force: true }).then(() => {
  initialRoles();
  initialTeams();
});

export { RoleModel, ProfileModel, SuspendModel, TeamModel };
