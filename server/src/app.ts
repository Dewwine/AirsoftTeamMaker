// Load enviroment variables
require('dotenv').config();

import express, { Application } from 'express';

// Routes
import auth from './routes/auth';
import profiles from './routes/profiles';
import admin from './routes/admin';
import manager from './routes/manager';
import player from './routes/player';

// PostgreSQL
import sequelize from './db/postgresdb';
// MongoDB
import mongoose from 'mongoose';
import mongoUrl from './db/mongodb';

// Middlewares
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Application = express();

sequelize
  .authenticate()
  .then(() => console.log('Connected to postgres'))
  .catch((err) => console.log(`Error: ${err}`));

mongoose.connect(mongoUrl, () => {
  console.log('Connected to mongo');
});

app.use(logger);

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: '*'
}));

app.use('/api/', auth);

app.use('/api/', manager);

app.use('/api/', player);

app.use('/api/', profiles);

app.use('/api/', admin);

app.use(errorHandler);

process.on('uncaughtException', (error: Error) => {
  console.log(error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error: Error) => {
  console.log(error.message);
});

export default app;
