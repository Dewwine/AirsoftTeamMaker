import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/postgresdb';

interface ITeamResponse {
  id: number;
  name: string;
}

interface ITeam extends Model {
  id: number;
  name: string;
}

class TeamModel extends Model implements ITeam {
  public id!: number;
  public name!: string;
}

TeamModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    updatedAt: false,
    createdAt: false,
    modelName: 'teams',
  },
);



export default TeamModel;
export { ITeam, ITeamResponse };
