import { ObjectId } from 'mongodb';

enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

interface IUser {
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

class User implements IUser {
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

  constructor(
    _id: ObjectId,
    name: string,
    email: string,
    password: string,
    username: string,
    verify: UserVerifyStatus = UserVerifyStatus.Unverified
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.username = username;
    this.verify = verify;
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  updateUsername(newUsername: string): void {
    this.username = newUsername;
    this.updated_at = new Date();
  }

  updateEmail(newEmail: string): void {
    this.email = newEmail;
    this.updated_at = new Date();
  }

  updateVerifyStatus(newStatus: UserVerifyStatus): void {
    this.verify = newStatus;
    this.updated_at = new Date();
  }
}

export { IUser, User, UserVerifyStatus };
