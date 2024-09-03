import { Db } from 'mongodb';
import { databaseService } from '../config/database';

async function createCollections() {
  const db: Db = await databaseService.connect();

  // Create collections
  await db.createCollection('users');
  await db.createCollection('tweets');
  await db.createCollection('hashtags');
  await db.createCollection('bookmarks');
  await db.createCollection('likes');
  await db.createCollection('followers');
  await db.createCollection('refresh_tokens');

  console.log('Collections created successfully');
}

export { createCollections };
