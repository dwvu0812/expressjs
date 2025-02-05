import jwt from 'jsonwebtoken';
import { TokenType } from '~/constants/enums';

export const signToken = ({
  payload,
  privateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: jwt.JwtPayload;
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
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded as jwt.JwtPayload);
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

export const generateRefreshToken = async (user_id: string, expiresIn?: string) => {
  return signToken({
    payload: {
      user_id,
      token_type: TokenType.RefreshToken
    },
    privateKey: process.env.JWT_SECRET_KEY as string,
    options: {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN_REFRESH_TOKEN || '7d'
    }
  });
};

export const generateEmailVerificationToken = async (user_id: string) => {
  return jwt.sign({ user_id, type: TokenType.EmailVerifyToken }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: process.env.JWT_EXPIRES_IN_EMAIL_VERIFY_TOKEN
  });
};
