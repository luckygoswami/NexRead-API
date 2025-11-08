import app from '@/app';
import { config } from '@/config';
import { connectDB } from '@/config';

async function startServer() {
  await connectDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
}

startServer();
