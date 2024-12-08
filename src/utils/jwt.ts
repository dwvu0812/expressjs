import jwt from 'jsonwebtoken';
import { TokenType } from '~/constants/enums';

export interface ITokenPayload {
  user_id: string;
  token_type: TokenType;
}

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: ITokenPayload;
  privateKey: string;
  options: jwt.SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) return reject(error);
      resolve(token as string);
    });
  });
};

export const verifyToken = ({ token, secretKey }: { token: string; secretKey: string }) => {
  return new Promise<ITokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded as ITokenPayload);
    });
  });
};

export const generateAccessToken = async (user_id: string) => {
  return signToken({
    payload: {
      user_id,
      token_type: TokenType.AccessToken
    },
    privateKey: process.env.JWT_SECRET_KEY as string,
    options: {
      expiresIn: process.env.JWT_EXPIRES_IN_ACCESS_TOKEN || '15m'
    }
  });
};

export const generateRefreshToken = async (user_id: string) => {
  return signToken({
    payload: {
      user_id,
      token_type: TokenType.RefreshToken
    },
    privateKey: process.env.JWT_SECRET_KEY as string,
    options: {
      expiresIn: process.env.JWT_EXPIRES_IN_REFRESH_TOKEN || '7d'
    }
  });
};
