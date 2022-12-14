/* eslint-disable no-unused-vars */
import { NotFoundError } from "errors/not-found.error";
import { NextFunction, Request, Response } from "express";
import { EndPoint } from "helpers/end-point.decorator";
import { FarmSortingFields, SuccessStatusCodes } from "helpers/enums";
import { CreateFarmResponseDto } from "./dto/create-farm-response.dto";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmsWithDistanceDto } from "./dto/farm-distance.dto";
import { FindFarmsOptionsDto } from "./dto/find-farms.options.dto";
import { GetFarmsQueryDto } from "./dto/get-farms-query.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { FarmsService } from "./farms.service";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }
  @EndPoint(SuccessStatusCodes.CREATED)
  public async create(req: Request, _res: Response, _next: NextFunction) {
    const farm = await this.farmsService.createFarm(req.body as CreateFarmDto, req.user);
    return new CreateFarmResponseDto(farm);
  }
  @EndPoint()
  public async update(req: Request, _res: Response, _next: NextFunction) {
    const { id } = req.params;
    const farm = await this.farmsService.updateFarm({ id }, req.body as UpdateFarmDto, req.user);
    return new CreateFarmResponseDto(farm);
  }
  @EndPoint()
  public async getOne(req: Request, _res: Response, next: NextFunction) {
    const { id } = req.params;
    const farm = await this.farmsService.findOneWithOwner({ id });
    if (!farm) return next(new NotFoundError());
    return new CreateFarmResponseDto(farm);
  }
  @EndPoint()
  public async delete(req: Request, _res: Response, _next: NextFunction) {
    const { id } = req.params;
    const farm = await this.farmsService.deleteFarm({ id }, req.user);
    return new CreateFarmResponseDto(farm);
  }
  @EndPoint()
  public async find(req: Request, _res: Response, _next: NextFunction) {
    const reqQuery = req.query as GetFarmsQueryDto;
    const query = new FindFarmsOptionsDto();
    await query.translate(reqQuery);

    const farms = await this.farmsService.find(query);
    return new FarmsWithDistanceDto(farms, req.user).merge(reqQuery.__sort === FarmSortingFields.DRIVING_DISTANCE);
  }
}
