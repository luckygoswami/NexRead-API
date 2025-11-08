import { config as envConfig } from 'dotenv';

envConfig();

const _config = {
  port: process.env.PORT as string,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING as string,
  env: process.env.NODE_ENV as string,
  jwt_secret: process.env.JWT_SECRET as string,
};

export const config = Object.freeze(_config);
