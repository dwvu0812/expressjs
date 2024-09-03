import express, { Express } from 'express';
import { databaseService } from './config/database';

const app: Express = express();
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    const db = await databaseService.connect();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await databaseService.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();
