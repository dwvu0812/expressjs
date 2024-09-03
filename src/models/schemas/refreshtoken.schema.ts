import { ObjectId } from 'mongodb';

interface RefreshToken {
  _id: ObjectId;
  token: string;
  created_at: Date;
  user_id: ObjectId;
}

export { RefreshToken };
