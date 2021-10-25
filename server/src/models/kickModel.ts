import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface IKick extends Model {
  profileId: number;
  isActive: string;
  kickReason: string;
  createdAt: Date;
  updatedAt: Date;
}

class kickModel extends Model implements IKick {
  public profileId!: number;

  public isActive!: string;
  public kickReason!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

kickModel.init(
  {
    isActive: {
      type: DataTypes.STRING,
    },
    kickReason: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'kickTable',
  },
);

export default kickModel;
export { IKick };
