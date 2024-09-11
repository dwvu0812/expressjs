import { Db } from 'mongodb';
import { databaseService } from '../config/database';

async function createCollections(db: Db) {
  const collections = ['users', 'tweets', 'hashtags', 'bookmarks', 'likes', 'followers', 'refresh_tokens'];

  for (const collection of collections) {
    if (await collectionExists(db, collection)) {
      continue;
    }
    await db.createCollection(collection);
  }

  console.log('Collections created successfully');
}

async function collectionExists(db: Db, collectionName: string): Promise<boolean> {
  const collections = await db.listCollections().toArray();
  return collections.some((col) => col.name === collectionName);
}

export { createCollections };
