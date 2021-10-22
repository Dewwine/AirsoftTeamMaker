import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface IRoleResponse {
  id: string;
  name: string;
}

interface IRole extends Model {
  id: string;
  name: string;
}

class RoleModel extends Model implements IRole {
  public id!: string;
  public name!: string;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: 'roles',
  },
);



export default RoleModel;
export { IRole, IRoleResponse };
