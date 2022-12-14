import { BadRequestError } from "./bad-request.error";

export class ValidationError extends BadRequestError {
  constructor(public errors: object, message: string = "Bad Request") {
    super(message);
  }
}
