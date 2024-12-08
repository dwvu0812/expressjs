import dotenv from 'dotenv';
import { Collection, Db, MongoClient } from 'mongodb';
import { RefreshToken } from '~/models/schemas/refreshToken.schema';
import { IUser } from '~/models/schemas/User.schema';

dotenv.config();

class DatabaseService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI!);
    this.db = this.client.db(process.env.DB_NAME);
  }

  public async connect() {
    try {
      await this.db?.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
      await this.client.close();
    }
  }

  get users(): Collection<IUser> | undefined {
    return this.db?.collection(process.env.DB_COLLECTION_USERS as string);
  }

  get refreshTokens(): Collection<RefreshToken> | undefined {
    return this.db?.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string);
  }
}

const databaseService = new DatabaseService();

export default databaseService;
