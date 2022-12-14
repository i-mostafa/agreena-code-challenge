import { RequestHandler, Router } from "express";
import { authGuard } from "middlewares/authGuard.middleware";
import { UsersController } from "modules/users/users.controller";

const router = Router();
const usersController = new UsersController();

router.use(authGuard);
router.post("/", usersController.create.bind(usersController) as RequestHandler);

export default router;
