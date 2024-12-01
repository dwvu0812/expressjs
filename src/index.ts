import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import userRoutes from './routes/users.routes';
import { databaseService } from './config/database';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

databaseService.connect()

app.use('/api', userRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
