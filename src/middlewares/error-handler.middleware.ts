import { AppError } from "errors/app.error";
import { InternalServerError } from "errors/internal-server.error";
import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line no-unused-vars
export function handleErrorMiddleware(error: Error | AppError, _: Request, res: Response, _next: NextFunction): void {
  if (!(error instanceof AppError)) {
    console.log({ ...error });
    error = new InternalServerError();
  }
  const { message, statusCode, ...rest } = error as AppError;
  res.status(statusCode).json({ message, statusCode, ...rest });
}
