import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface IManagerRequest extends Model {
  id: string;
  profileId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class ManagerRequestModel extends Model implements IManagerRequest {
  public id!: string;

  public profileId!: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ManagerRequestModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profileId: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'managerRequests',
  },
);

ManagerRequestModel.sync();

export default ManagerRequestModel;
export { IManagerRequest };
