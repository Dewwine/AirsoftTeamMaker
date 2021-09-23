import Sequelize from "sequelize";
import postgresdb from "../db/postgresdb";

const Profile = postgresdb.define('profile', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  login: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.STRING,
  },
  avatar: {
    type: Sequelize.STRING,
  },
  team: {
    type: Sequelize.STRING,
  }
}, {
  timestamps: false,
});

Profile.sync();

export default Profile;