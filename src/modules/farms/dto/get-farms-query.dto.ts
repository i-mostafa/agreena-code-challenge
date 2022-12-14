import { IsBooleanString, IsEnum, IsOptional } from "class-validator";
import { FarmSortingFields, StringifiedBoolean } from "helpers/enums";

export class GetFarmsQueryDto {
  @IsEnum(FarmSortingFields, {
    message: `__Sort Must be one of [${Object.values(FarmSortingFields)}]`,
  })
  @IsOptional()
  public __sort?: FarmSortingFields;

  @IsBooleanString()
  @IsOptional()
  public __outliers?: StringifiedBoolean;
}
