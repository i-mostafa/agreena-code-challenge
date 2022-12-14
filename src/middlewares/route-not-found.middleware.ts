import { NotFoundError } from "errors/not-found.error";
import { NextFunction, Request, Response } from "express";

// eslint-disable-next-line no-unused-vars
export function routNotFoundHandler(_: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError("Can't reach this route"));
}
