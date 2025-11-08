import app from './src/app';
import { config } from './src/config';
import { connectDB } from './src/config/db';

async function startServer() {
  await connectDB();

  const port = config.port || 3000;

  app.get('/', (req, res) => {
    res.send({ message: 'Hello Express world!' });
  });

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer();
