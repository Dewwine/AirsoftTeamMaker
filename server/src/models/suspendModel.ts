import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface ISuspend extends Model {
  profileId: string;
  isActive: string;
  suspendReason: string;
  createdAt: Date;
  updatedAt: Date;
}

class suspendModel extends Model implements ISuspend {
  public profileId!: string;

  public isActive!: string;
  public suspendReason!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

suspendModel.init(
  {
    profileId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    isActive: {
      type: DataTypes.STRING,
    },
    suspendReason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'suspendTable',
  },
);

suspendModel.sync();

export default suspendModel;
export { ISuspend };
