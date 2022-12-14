/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { EndPoint } from "helpers/end-point.decorator";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  @EndPoint()
  public async login(req: Request, _res: Response, _next: NextFunction) {
    const { token } = await this.authService.login(req.body as LoginUserDto);
    return { token };
  }
  @EndPoint()
  public async register(req: Request, _res: Response, _next: NextFunction) {
    const { token } = await this.authService.register(req.body as CreateUserDto);
    return { token };
  }
}
