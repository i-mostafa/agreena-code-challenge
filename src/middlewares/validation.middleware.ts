import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ValidationError } from "errors/validation.error";
import { NextFunction, Request, Response } from "express";
import { ReqFields } from "helpers/enums";

export function validateReqField<T>(reqField: ReqFields, TargetClass: { new (partial: Partial<T>): T }) {
  return function validationMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const data = plainToInstance(TargetClass, req[reqField], {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });

    const errors = validateSync(data as object, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      const errData = errors.reduce((acc, curr) => {
        return { ...acc, [curr.property]: Object.values(curr.constraints || {}).join(", ") };
      }, {});

      throw new ValidationError(errData);
    }
    req[reqField] = data;
    next();
  };
}
