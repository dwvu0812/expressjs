import { ObjectId } from 'mongodb';

enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

interface IUser {
  readonly _id: ObjectId;
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

class User implements IUser {
  readonly _id: ObjectId;
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

  constructor(user: Partial<IUser>) {
    this._id = user._id || new ObjectId();
    this.name = user.name || '';
    this.email = user.email || '';
    this.password = user.password || '';
    this.username = user.username || '';
    this.created_at = user.created_at || new Date();
    this.updated_at = user.updated_at || new Date();
    this.verify = user.verify || UserVerifyStatus.Unverified;
    this.date_of_birth = user.date_of_birth;
    this.email_verify_token = user.email_verify_token;
    this.forgot_password_token = user.forgot_password_token;
    this.bio = user.bio;
    this.location = user.location;
    this.website = user.website;
    this.avatar = user.avatar;
    this.cover_photo = user.cover_photo;
  }


}

export { IUser, User, UserVerifyStatus };
