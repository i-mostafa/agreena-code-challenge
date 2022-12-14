import { ResponseStatus } from "helpers/enums";
import { AppError } from "./app.error";

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, ResponseStatus.FAILED, 404);
  }
}
