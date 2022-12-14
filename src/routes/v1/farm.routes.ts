import { RequestHandler, Router } from "express";
import { ReqFields } from "helpers/enums";
import { authGuard } from "middlewares/authGuard.middleware";
import { validateReqField } from "middlewares/validation.middleware";
import { ByIdDto } from "modules/farms/dto/byId.dto";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { GetFarmsQueryDto } from "modules/farms/dto/get-farms-query.dto";
import { UpdateFarmDto } from "modules/farms/dto/update-farm.dto";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

router.use(authGuard);

router
  .route("/")
  .post(validateReqField(ReqFields.BODY, CreateFarmDto), farmsController.create.bind(farmsController) as RequestHandler)
  .get(validateReqField(ReqFields.QUERY, GetFarmsQueryDto), farmsController.find.bind(farmsController) as RequestHandler);

router
  .route("/:id")
  .all(validateReqField(ReqFields.PARAMS, ByIdDto))
  .patch(validateReqField(ReqFields.BODY, UpdateFarmDto), farmsController.update.bind(farmsController) as RequestHandler)
  .get(farmsController.getOne.bind(farmsController) as RequestHandler)
  .delete(farmsController.delete.bind(farmsController) as RequestHandler);

export default router;
