import ProfileModel from './profileModel';
import RoleModel from './roleModel';
import SuspendModel from './suspendModel';
import sequelize from '../db/postgresdb';

SuspendModel.belongsTo(ProfileModel);

ProfileModel.hasOne(SuspendModel);


ProfileModel.belongsTo(RoleModel);

RoleModel.hasMany(ProfileModel);

const initial = () => {
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

sequelize.sync({ force: true }).then(() => {
  initial();
});

export { RoleModel, ProfileModel, SuspendModel };
