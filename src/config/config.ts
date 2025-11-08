import { config as envConfig } from 'dotenv';

envConfig();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING,
};

export const config = Object.freeze(_config);
