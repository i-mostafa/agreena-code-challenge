import { ResponseStatus } from "helpers/enums";
import { AppError } from "./app.error";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, ResponseStatus.FAILED, 403);
  }
}
