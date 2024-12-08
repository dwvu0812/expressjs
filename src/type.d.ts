import { Request } from 'express';
import { ITokenPayload } from './utils/jwt';
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
