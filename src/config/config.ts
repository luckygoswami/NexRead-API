import { config as envConfig } from 'dotenv';

envConfig();

const _config = {
  port: process.env.PORT as string,
  databaseUrl: process.env.MONGODB_CONNECTION_STRING as string,
  env: process.env.NODE_ENV as string,
  jwtSecret: process.env.JWT_SECRET as string,
  cloudName: process.env.CLOUD_NAME as string,
  cloudApiKey: process.env.CLOUD_API_KEY as string,
  cloudApiSecret: process.env.CLOUD_API_SECRET as string,
};

export const config = Object.freeze(_config);
