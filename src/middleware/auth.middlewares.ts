import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { COMMON_MESSAGES } from '~/constants/messages';
import { verifyToken } from '~/utils/jwt';

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: COMMON_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    });
  }
  const token = accessToken.split(' ')[1];
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: COMMON_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
    });
  }

  try {
    const decoded = await verifyToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY as string
    });
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: COMMON_MESSAGES.INVALID_ACCESS_TOKEN
    });
  }
};
