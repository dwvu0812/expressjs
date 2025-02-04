import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { UserVerifyStatus } from '~/models/schemas/User.schema';
import refreshTokenService from '~/services/refreshToken.services';
import usersService from '~/services/users.services';
import { comparePassword, hashPassword } from '~/utils/crypto';
import { generateAccessToken, generateRefreshToken, verifyToken, generateEmailVerificationToken } from '~/utils/jwt';
import jwt from 'jsonwebtoken';
import { EmailService } from '~/services/email.services';
import { TokenType } from '~/constants/enums';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await usersService.findUserByEmail(email);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
      });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
      });
    }
    const accessToken = await generateAccessToken(user._id.toString());
    const refreshToken = await generateRefreshToken(user._id.toString());

    await refreshTokenService.createRefreshToken(user._id.toString(), refreshToken);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.LOGIN_FAILED,
      error
    });
  }
};

export const registerController = async (req: Request, res: Response) => {
  const { email, password, name, username } = req.body;

  try {
    const existingEmail = await usersService.findUserByEmail(email);

    if (existingEmail) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await usersService.createUser({
      email,
      password: hashedPassword,
      name,
      username,
      verify: UserVerifyStatus.Unverified
    });

    // Generate and send verification email
    const verificationToken = await generateEmailVerificationToken(user._id.toString());
    await EmailService.sendVerificationEmail(email, verificationToken);

    return res.status(HTTP_STATUS.CREATED).json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      data: {
        user: {
          email: user.email,
          name: user.name,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.REGISTER_FAILED,
      error
    });
  }
};

export const verifyEmailController = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.VERIFICATION_TOKEN_IS_REQUIRED
    });
  }

  try {
    const decoded = await verifyToken({
      token,
      secretKey: process.env.JWT_SECRET_KEY as string
    });

    if (decoded.type !== TokenType.EmailVerifyToken) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.INVALID_VERIFICATION_TOKEN
      });
    }

    const user = await usersService.findUserById(decoded.user_id);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      });
    }

    if (user.verify === UserVerifyStatus.Verified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
      });
    }

    await usersService.updateVerificationStatus(user._id.toString(), UserVerifyStatus.Verified);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.VERIFICATION_TOKEN_EXPIRED
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.EMAIL_VERIFY_FAILED,
      error
    });
  }
};

export const resendVerificationEmailController = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: USERS_MESSAGES.VALIDATION_ERROR.EMAIL_IS_REQUIRED
    });
  }

  try {
    const user = await usersService.findUserByEmail(email);

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: USERS_MESSAGES.USER_NOT_FOUND
      });
    }

    if (user.verify === UserVerifyStatus.Verified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED
      });
    }

    const verificationToken = await generateEmailVerificationToken(user._id.toString());
    await EmailService.sendVerificationEmail(email, verificationToken);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_FAILED,
      error
    });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
    });
  }

  try {
    // verify refresh token
    const decoded = await verifyToken({
      token: refresh_token,
      secretKey: process.env.JWT_SECRET_KEY as string
    });

    // check if refresh token is used
    const refresh_token_used = await refreshTokenService.findRefreshToken(refresh_token);
    if (!refresh_token_used) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST
      });
    }

    const remainingTime = Math.floor(((decoded.exp as number) * 1000 - Date.now()) / 1000);

    // generate new token
    const user_id = decoded.user_id;
    const [new_access_token, new_refresh_token] = await Promise.all([
      generateAccessToken(user_id),
      generateRefreshToken(user_id, `${remainingTime}s`)
    ]);

    await Promise.all([
      refreshTokenService.deleteRefreshToken(refresh_token),
      refreshTokenService.createRefreshToken(user_id, new_refresh_token)
    ]);

    return res.status(HTTP_STATUS.OK).json({
      message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      accessToken: new_access_token,
      refreshToken: new_refresh_token
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.REFRESH_TOKEN_EXPIRED
      });
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.REFRESH_TOKEN_FAILED,
      error
    });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
    });
  }

  try {
    // Delete refresh token from database
    await refreshTokenService.deleteRefreshToken(refresh_token);

    return res.json({
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.LOGOUT_FAILED
    });
  }
};
