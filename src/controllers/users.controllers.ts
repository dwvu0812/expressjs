import { Request, Response } from 'express';
import { HTTP_STATUS } from '~/constants/httpStatus';
import { USERS_MESSAGES } from '~/constants/messages';
import { UserVerifyStatus } from '~/models/schemas/User.schema';
import refreshTokenService from '~/services/refreshToken.services';
import usersService from '~/services/users.services';
import { comparePassword, hashPassword } from '~/utils/crypto';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt';

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
