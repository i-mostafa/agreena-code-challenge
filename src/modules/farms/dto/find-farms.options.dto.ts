import { Farm } from "../entities/farm.entity";
import { FindManyOptions, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere, LessThan, MoreThan } from "typeorm";
import { GetFarmsQueryDto } from "./get-farms-query.dto";
import { FarmSortingFields, SortDirections, StringifiedBoolean } from "helpers/enums";
import { FarmsService } from "../farms.service";
import config from "config/config";

export class FindFarmsOptionsDto implements FindManyOptions<Farm> {
  public order?: FindOptionsOrder<Farm> | undefined;
  public relations?: FindOptionsRelations<Farm> | undefined;
  public where?: FindOptionsWhere<Farm> | FindOptionsWhere<Farm>[] | undefined;

  public async translate(query: GetFarmsQueryDto, withOwner: boolean = true) {
    this.translateSort(query.__sort);
    await this.translateOutliers(query.__outliers);
    if (withOwner) {
      this.relations ||= {};
      this.relations.owner = true;
    }
  }

  private translateSort(sortField?: FarmSortingFields) {
    if (!sortField) return;
    this.order ||= {};
    switch (sortField) {
      case FarmSortingFields.NAME:
        this.order.name = SortDirections.ASC;
        return;
      case FarmSortingFields.DATE:
        this.order.createdAt = SortDirections.DESC;
        return;
    }
  }

  private async translateOutliers(useOutlier?: StringifiedBoolean) {
    if (!useOutlier || useOutlier === StringifiedBoolean.FALSE) return;
    const farmsService = new FarmsService();

    const avg = await farmsService.getAvgYield();
    const outlierPercentage = (config.OUTLIERS_PERCENTAGE * avg) / 100;
    this.where = [
      {
        yield: MoreThan(avg + outlierPercentage),
      },
      { yield: LessThan(avg - outlierPercentage) },
    ];
  }
}
