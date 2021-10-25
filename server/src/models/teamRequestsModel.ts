import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface ITeamRequest extends Model {
  id: string;
  profileId: string;
  teamRequest: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

class TeamRequestModel extends Model implements ITeamRequest {
  public id!: string;

  public profileId!: string;
  public teamRequest!: number;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TeamRequestModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profileId: {
      type: DataTypes.INTEGER,
    },
    teamRequest: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'teamRequests',
  },
);

TeamRequestModel.sync();

export default TeamRequestModel;
export { ITeamRequest };
