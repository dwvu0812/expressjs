// middleware/auth.ts
import { Request, Response, NextFunction } from 'express'

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.headers
  if (token === 'valid-token') {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

export default authMiddleware
