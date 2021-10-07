import { Sequelize } from 'sequelize';

require('dotenv').config();

const postgresName: string = process.env.POSTGRES_NAME || 'profiles';
const postgresUser: string = process.env.POSTGRES_USER || 'postgres';
const postgresPassword: string = process.env.POSTGRES_PASSWORD || 'postgres';

const sequelize: Sequelize = new Sequelize(postgresName, postgresUser, postgresPassword, {
  host: process.env.POSTGRES_HOST || 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
