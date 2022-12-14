import { ResponseStatus } from "helpers/enums";
import { AppError } from "./app.error";

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, ResponseStatus.ERROR, 500);
  }
}
