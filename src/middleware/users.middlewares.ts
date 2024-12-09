import { NextFunction, Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import { USERS_MESSAGES } from '~/constants/messages';

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send(USERS_MESSAGES.VALIDATION_ERROR.EMAIL_AND_PASSWORD_ARE_REQUIRED);
  }

  next();
};

export const registerValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.EMAIL_IS_INVALID
    },
    trim: true,
    normalizeEmail: true,
    custom: {
      options: (value) => {
        if (!value) {
          throw new Error(USERS_MESSAGES.VALIDATION_ERROR.EMAIL_IS_REQUIRED);
        }
        return true;
      }
    }
  },
  password: {
    isLength: {
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
      options: { min: 6, max: 50 }
    },
    custom: {
      options: (value) => {
        if (!value) {
          throw new Error(USERS_MESSAGES.VALIDATION_ERROR.PASSWORD_IS_REQUIRED);
        }
        return true;
      }
    }
  },
  confirm_password: {
    custom: {
      options: (value, { req }) => {
        if (!value) {
          throw new Error(USERS_MESSAGES.VALIDATION_ERROR.CONFIRM_PASSWORD_IS_REQUIRED);
        }
        if (value !== req.body.password) {
          throw new Error(USERS_MESSAGES.VALIDATION_ERROR.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD);
        }
        return true;
      }
    }
  },
  name: {
    isLength: {
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.NAME_LENGTH_MUST_BE_FROM_3_TO_50,
      options: { min: 3, max: 50 }
    },
    isString: {
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.NAME_MUST_BE_STRING
    },
    trim: true,
    escape: true
  },
  username: {
    isLength: {
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.USERNAME_LENGTH_MUST_BE_FROM_3_TO_30,
      options: { min: 3, max: 30 }
    },
    matches: {
      options: /^[a-zA-Z0-9_]+$/,
      errorMessage: USERS_MESSAGES.VALIDATION_ERROR.USERNAME_INVALID
    },
    trim: true,
    escape: true
  }
});
