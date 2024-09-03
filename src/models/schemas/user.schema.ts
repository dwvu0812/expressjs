import { ObjectId } from 'mongodb';

enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  verify: UserVerifyStatus;
  date_of_birth?: Date;
  email_verify_token?: string;
  forgot_password_token?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  cover_photo?: string;
}

export { User, UserVerifyStatus };
