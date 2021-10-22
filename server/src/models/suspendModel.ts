import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface ISuspend extends Model {
  profileId: number;
  isActive: string;
  suspendReason: string;
  createdAt: Date;
  updatedAt: Date;
}

class suspendModel extends Model implements ISuspend {
  public profileId!: number;

  public isActive!: string;
  public suspendReason!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

suspendModel.init(
  {
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

export default suspendModel;
export { ISuspend };
