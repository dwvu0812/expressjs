import { ObjectId } from 'mongodb';

interface Hashtag {
  _id: ObjectId;
  name: string;
  created_at: Date;
}

export { Hashtag };
