import { Router } from "express";
import { loginController } from "~/controllers/users.controllers";
import { loginValidator } from "~/middleware/users.middlewares";

const router = Router();

router.post('/users/login', loginValidator, loginController)

export default router;