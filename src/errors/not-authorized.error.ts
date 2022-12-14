import { ResponseStatus } from "helpers/enums";
import { AppError } from "./app.error";

export class NotAuthorizedError extends AppError {
  constructor(message: string = "Not Authorized") {
    super(message, ResponseStatus.FAILED, 401);
  }
}
