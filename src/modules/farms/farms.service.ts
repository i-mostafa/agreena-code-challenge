import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { Farm } from "./entities/farm.entity";
import dataSource from "orm/orm.config";
import { User } from "modules/users/entities/user.entity";
import { FindFarmsOptionsDto } from "./dto/find-farms.options.dto";
import { GoogleMapsClient } from "helpers/google-maps";
import { NotFoundError } from "errors/not-found.error";
import { ForbiddenError } from "errors/forbidden.error";

export class FarmsService {
  private readonly farmsRepository: Repository<Farm>;

  constructor() {
    this.farmsRepository = dataSource.getRepository(Farm);
  }

  public async createFarm(data: CreateFarmDto, user: User): Promise<Farm> {
    const coordinates = await GoogleMapsClient.getCoordinates(data.address);
    const newFarm = this.farmsRepository.create({ ...data, owner: user, coordinates });

    return this.farmsRepository.save(newFarm);
  }

  public async updateFarm(param: FindOptionsWhere<Farm>, update: Partial<Farm>, user: User) {
    const farm = await this.GetFarmWithAuthCheck(param, user);
    if (update.address) update.coordinates = await GoogleMapsClient.getCoordinates(update.address);
    return this.farmsRepository.save({ ...farm, ...update });
  }

  public async findOneWithOwner(param: FindOptionsWhere<Farm>): Promise<Farm | null> {
    return this.farmsRepository.findOne({
      where: param,
      relations: {
        owner: true,
      },
    });
  }
  public async findOne(options: FindManyOptions<Farm>): Promise<Farm | null> {
    return this.farmsRepository.findOne(options);
  }
  public async deleteFarm(param: FindOptionsWhere<Farm>, user: User) {
    const farm = await this.GetFarmWithAuthCheck(param, user);
    return this.farmsRepository.remove(farm);
  }
  public async find(query: FindFarmsOptionsDto): Promise<Farm[]> {
    return this.farmsRepository.find(query);
  }
  public async getAvgYield() {
    const { avg } = (await this.farmsRepository.createQueryBuilder("farm").select("AVG(yield)", "avg").getRawOne()) as {
      avg: number;
    };
    return avg;
  }

  private async GetFarmWithAuthCheck(param: FindOptionsWhere<Farm>, user: User) {
    const farm = await this.findOne({
      where: param,
      relations: {
        owner: true,
      },
    });
    if (!farm) throw new NotFoundError("NOT Found");
    if (farm.owner.id !== user.id) throw new ForbiddenError("You are not the owner of this farm");
    return farm;
  }
}
