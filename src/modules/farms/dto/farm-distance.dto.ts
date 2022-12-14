import { GoogleMapsClient } from "helpers/google-maps";
import { FarmWithDistance } from "helpers/interfaces";
import { User } from "modules/users/entities/user.entity";
import { Farm } from "../entities/farm.entity";
import { CreateFarmResponseDto } from "./create-farm-response.dto";

export class FarmsWithDistanceDto {
  constructor(private farms: Farm[], private user: User) {}

  public async merge(sortByDistance: boolean = false) {
    const coordinates = this.farms.map(farm => farm.coordinates);
    const drivingDistances = await GoogleMapsClient.calcDistance(this.user.coordinates, coordinates);
    const farms: FarmWithDistance[] = [];

    drivingDistances.forEach((distance, idx) =>
      farms.push({ ...new CreateFarmResponseDto(this.farms[idx]), drivingDistance: distance }),
    );
    if (sortByDistance) farms.sort((a, b) => a.drivingDistance - b.drivingDistance);
    return farms;
  }
}
