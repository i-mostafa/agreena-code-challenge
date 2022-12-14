import { ResponseStatus } from "helpers/enums";
import { AppError } from "./app.error";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, ResponseStatus.FAILED, 400);
  }
}
