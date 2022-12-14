import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  public NODE_ENV: string;

  @IsNumber()
  @IsNotEmpty()
  public APP_PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  public APP_HOST: string = "localhost";

  @IsString()
  @IsNotEmpty()
  public DB_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  public DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  public DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  public DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  public DB_NAME: string;

  @IsNumber()
  @IsNotEmpty()
  public SALT_ROUNDS: number;

  @IsNumber()
  @IsNotEmpty()
  public GOOGLE_MAPS_DISTANCE_MATRIX_LIMIT: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  public OUTLIERS_PERCENTAGE: number;

  @IsString()
  @IsNotEmpty()
  public JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  public JWT_EXPIRES_AT: string;

  @IsString()
  @IsNotEmpty()
  public GOOGLE_MAPS_API_KEY: string;
}
