import { Router } from 'express';
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers';
import { verifyAccessToken } from '~/middleware/auth.middlewares';
import { loginValidator, registerValidator } from '~/middleware/users.middlewares';
import { validate } from '~/utils/validation';

const router = Router();

router.post('/login', loginValidator, loginController);
router.post('/register', validate(registerValidator), registerController);

router.get('/me', verifyAccessToken, (req, res) => {
  res.json({ user: req.user });
});

router.post('/refresh-token', refreshTokenController);
router.post('/logout', logoutController);

export default router;
