import mongoose from 'mongoose';
import { config } from './config';

export async function connectDB() {
  try {
    mongoose.connection.on('connected', () => {
      console.log(`Connected to DB successfully.`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Error in connecting the DB: ${err}`);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (err) {
    console.error(`Error in connecting the DB: ${err}`);
    process.exit(1);
  }
}
