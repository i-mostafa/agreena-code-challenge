import { ResponseStatus } from "helpers/enums";
export class AppError extends Error {
  constructor(message: string, public status: ResponseStatus, public statusCode: number) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
