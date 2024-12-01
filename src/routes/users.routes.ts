import { Router } from "express";
import { loginController, registerController } from "~/controllers/users.controllers";
import { loginValidator } from "~/middleware/users.middlewares";

const router = Router();

router.post('/users/login', loginValidator, loginController)
router.post('/users/register', registerController)

export default router;