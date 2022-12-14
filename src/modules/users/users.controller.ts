/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { EndPoint } from "helpers/end-point.decorator";
import { SuccessStatusCodes } from "helpers/enums";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }
  @EndPoint(SuccessStatusCodes.CREATED)
  public async create(req: Request, _res: Response, _next: NextFunction) {
    const user = await this.usersService.createUser(req.body as CreateUserDto);
    return user;
  }
}
