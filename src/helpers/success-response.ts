import { ResponseStatus } from "./enums";

export class SuccessResponse {
  public status = ResponseStatus.SUCCESS;
  public numberOfRecords?: number;
  constructor(public data: object) {
    if (Array.isArray(data)) this.numberOfRecords = data.length;
  }
}
