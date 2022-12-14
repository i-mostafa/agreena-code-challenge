import { RequestHandler, Router } from "express";
import { ReqFields } from "helpers/enums";
import { validateReqField } from "middlewares/validation.middleware";
import { AuthController } from "modules/auth/auth.controller";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";
import { CreateUserDto } from "modules/users/dto/create-user.dto";

const router = Router();
const authController = new AuthController();

router.post(
  "/login",
  validateReqField(ReqFields.BODY, LoginUserDto),
  authController.login.bind(authController) as RequestHandler,
);
router.post(
  "/register",
  validateReqField(ReqFields.BODY, CreateUserDto),
  authController.register.bind(authController) as RequestHandler,
);

export default router;
