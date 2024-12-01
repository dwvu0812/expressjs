import { IUser, User } from "~/models/schemas/User.schema";
import databaseService from "./database.services"

class UsersService {
    private users = databaseService.users;

    async createUser(user: Omit<IUser, '_id' | 'created_at' | 'updated_at'>) {
        const newUser = new User({
            ...user,
            created_at: new Date(),
            updated_at: new Date()
        })
        await this.users?.insertOne(newUser);
        return newUser;
    }

    async findUserByEmail(email: string) {
        return await this.users?.findOne({ email });
    }

}

const usersService = new UsersService();

export default usersService;