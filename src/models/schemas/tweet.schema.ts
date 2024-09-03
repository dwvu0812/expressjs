import { ObjectId } from 'mongodb';

enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

enum TweetAudience {
  Everyone,
  TwitterCircle
}

interface Media {
  url: string;
  type: string;
}

interface Tweet {
  _id: ObjectId;
  user_id: ObjectId;
  type: TweetType;
  audience: TweetAudience;
  content: string;
  parent_id?: ObjectId;
  hashtags: ObjectId[];
  mentions: ObjectId[];
  medias: Media[];
  guest_views: number;
  user_views: number;
  created_at: Date;
  updated_at: Date;
}

export { Tweet, TweetType, TweetAudience, Media };
