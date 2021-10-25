"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require('dotenv').config();
const postgresName = process.env.POSTGRES_NAME || 'profiles';
const postgresUser = process.env.POSTGRES_USER || 'postgres';
const postgresPassword = process.env.POSTGRES_PASSWORD || 'postgres';
const sequelize = new sequelize_1.Sequelize(postgresName, postgresUser, postgresPassword, {
    host: process.env.POSTGRES_HOST || 'localhost',
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
exports.default = sequelize;
