import { Router } from "express";
import { loginController, registerController } from "~/controllers/users.controllers";
import { loginValidator, registerValidator } from "~/middleware/users.middlewares";
import { validate } from "~/utils/validation";

const router = Router();

router.post('/login', loginValidator, loginController)
router.post('/register', validate(registerValidator), registerController)

export default router;