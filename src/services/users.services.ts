import { IUser, User, UserVerifyStatus } from '~/models/schemas/User.schema';
import databaseService from './database.services';
import { ObjectId } from 'mongodb';

class UsersService {
  private users = databaseService.users;

  async createUser(user: Omit<IUser, '_id' | 'created_at' | 'updated_at'>) {
    const newUser = new User({
      ...user,
      created_at: new Date(),
      updated_at: new Date()
    });
    await this.users?.insertOne(newUser);
    return newUser;
  }

  async findUserByEmail(email: string) {
    return await this.users?.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.users?.findOne({ _id: new ObjectId(id) });
  }

  async updateVerificationStatus(userId: string, status: UserVerifyStatus) {
    return await this.users?.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          verify: status,
          updated_at: new Date()
        }
      }
    );
  }
}

const usersService = new UsersService();

export default usersService;
