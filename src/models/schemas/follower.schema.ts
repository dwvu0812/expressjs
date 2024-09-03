import { ObjectId } from 'mongodb';

interface Follower {
  _id: ObjectId;
  user_id: ObjectId;
  followed_user_id: ObjectId;
  created_at: Date;
}

export { Follower };
