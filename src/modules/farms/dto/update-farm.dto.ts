import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFarmDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  public address?: string;

  @IsNumber()
  @IsOptional()
  public yield?: number;

  @IsNumber()
  @IsOptional()
  public size?: number;
}
