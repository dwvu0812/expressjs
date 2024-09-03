import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
  private client: MongoClient;
  private db: Db | null = null;

  constructor(private readonly uri: string) {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
  }

  public async connect(): Promise<Db> {
    try {
      await this.client.connect();
      console.log('Connected successfully to MongoDB Atlas');
      this.db = this.client.db(process.env.DB_NAME);
      return this.db;
    } catch (error) {
      console.error('Error connecting to MongoDB Atlas:', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    await this.client.close();
    console.log('Closed MongoDB connection');
  }
}

export class DatabaseService {
  private database: Database;

  constructor(uri: string) {
    this.database = new Database(uri);
  }

  public async connect(): Promise<Db> {
    return await this.database.connect();
  }

  public async close(): Promise<void> {
    await this.database.close();
  }
}

// Create and export an instance of DatabaseService
const databaseService = new DatabaseService(process.env.MONGODB_URI || '');
export { databaseService };
