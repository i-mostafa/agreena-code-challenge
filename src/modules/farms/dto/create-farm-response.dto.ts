import { Farm } from "../entities/farm.entity";
import { CreateFarmDto } from "./create-farm.dto";

export class CreateFarmResponseDto extends CreateFarmDto {
  public owner: string;

  constructor(farm: Farm) {
    super();
    Object.assign(this, farm);
    this.owner = farm.owner.email;
  }
}
