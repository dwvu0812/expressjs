export const COMMON_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  INVALID_ACCESS_TOKEN: 'Invalid access token'
} as const;

export const USERS_MESSAGES = {
  VALIDATION_ERROR: {
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_IS_INVALID: 'Invalid email format',
    PASSWORD_IS_REQUIRED: 'Password is required',
    PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password must be 6-50 characters',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
    CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Passwords do not match',
    NAME_IS_REQUIRED: 'Name is required',
    NAME_LENGTH_MUST_BE_FROM_3_TO_50: 'Name must be 3-50 characters',
    NAME_MUST_BE_STRING: 'Name must be a string',
    USERNAME_IS_REQUIRED: 'Username is required',
    USERNAME_LENGTH_MUST_BE_FROM_3_TO_30: 'Username must be 3-30 characters',
    USERNAME_INVALID: 'Username can only contain letters, numbers and underscore',
    EMAIL_AND_PASSWORD_ARE_REQUIRED: 'Email and password are required'
  },
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'User created successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  LOGOUT_SUCCESS: 'Logout success',
  LOGIN_FAILED: 'Login failed',
  REGISTER_FAILED: 'Registration failed',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
  REFRESH_TOKEN_FAILED: 'Refresh token failed',
  LOGOUT_FAILED: 'Logout failed'
} as const;
