import { User } from "modules/users/entities/user.entity";

export {};

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
