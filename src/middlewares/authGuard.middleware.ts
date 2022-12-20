import config from "config/config";
import { fromUnixTime } from "date-fns";
import { NotAuthorizedError } from "errors/not-authorized.error";
import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { User } from "modules/users/entities/user.entity";

export function authGuard(req: Request, _: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) return next(new NotAuthorizedError());

  const token = authorizationHeader.split(" ")[1];
  if (!token) return next(new NotAuthorizedError());
  let decoded: string | JwtPayload;
  try {
    decoded = verify(token, config.JWT_SECRET);
  } catch (e) {
    return next(new NotAuthorizedError());
  }

  if (!decoded) return next(new NotAuthorizedError());

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { iat, exp, ...user } = decoded as Record<string, any>;

  if (fromUnixTime(exp as number).getTime() < new Date().getTime()) return next(new NotAuthorizedError("Token Expired"));

  // In a real application we should also search for this user in db
  // as maybe this user token is valid but the user is deleted by an admin for example
  // since we don't have this scenario here i will just assign it to request
  req.user = user as User;

  next();
}
