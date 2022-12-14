/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NextFunction, Request, RequestHandler, Response } from "express";
import { SuccessStatusCodes } from "./enums";
import { SuccessResponse } from "./success-response";

export function catchAsyncHandler(fn: RequestHandler, statusCode: SuccessStatusCodes) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fn.bind(this)(req, res, next))
      .then(data => res.status(statusCode).json(new SuccessResponse(data as object)))
      .catch(next);
  };
}

export function EndPoint(statusCode: SuccessStatusCodes = SuccessStatusCodes.SUCCESS) {
  return function (_: Object, __: string | symbol, descriptor: PropertyDescriptor) {
    descriptor.value = catchAsyncHandler(descriptor.value as RequestHandler, statusCode);
    return descriptor;
  };
}
