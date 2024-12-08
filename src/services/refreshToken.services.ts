import { ObjectId } from 'mongodb';
import databaseService from './database.services';

class RefreshTokenService {
  private refreshTokens = databaseService.refreshTokens;

  async createRefreshToken(user_id: string, token: string) {
    const refreshToken = {
      _id: new ObjectId(),
      token,
      created_at: new Date(),
      user_id: new ObjectId(user_id)
    };
    await this.refreshTokens?.insertOne(refreshToken);
    return refreshToken;
  }

  async findRefreshToken(token: string) {
    return this.refreshTokens?.findOne({ token });
  }

  async deleteRefreshToken(token: string) {
    await this.refreshTokens?.deleteOne({ token });
  }
}

const refreshTokenService = new RefreshTokenService();

export default refreshTokenService;
