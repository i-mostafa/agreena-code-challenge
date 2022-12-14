import { IsNotEmpty, IsUUID } from "class-validator";

export class ByIdDto {
  @IsUUID()
  @IsNotEmpty()
  public readonly id: string;
}
