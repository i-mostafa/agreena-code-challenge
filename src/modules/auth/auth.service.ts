import * as bcrypt from "bcrypt";
import config from "config/config";
import { fromUnixTime } from "date-fns";
import { decode, sign } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import { AccessToken } from "./entities/access-token.entity";
import dataSource from "orm/orm.config";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { User } from "modules/users/entities/user.entity";
import { NotAuthorizedError } from "errors/not-authorized.error";

export class AuthService {
  private readonly accessTokenRepository: Repository<AccessToken>;
  private readonly usersService: UsersService;

  constructor() {
    this.accessTokenRepository = dataSource.getRepository(AccessToken);
    this.usersService = new UsersService();
  }

  public async login(data: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.findOneBy({ email: data.email });

    if (!user) throw new NotAuthorizedError("Invalid user email or password");

    const isValidPassword = await this.validatePassword(data.password, user.hashedPassword);

    if (!isValidPassword) throw new NotAuthorizedError("Invalid user email or password");

    const newToken = this.generateJwtToken(user);

    return this.accessTokenRepository.save(newToken);
  }

  public async register(data: CreateUserDto) {
    const user = await this.usersService.createUser(data);
    const newToken = this.generateJwtToken(user);

    return this.accessTokenRepository.save(newToken);
  }

  private generateJwtToken(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { hashedPassword, ...userData } = user;
    const token = sign(userData, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_AT });
    const tokenExpireDate = this.getJwtTokenExpireDate(token);

    return this.accessTokenRepository.create({
      token,
      user,
      expiresAt: fromUnixTime(tokenExpireDate),
    });
  }

  private getJwtTokenExpireDate(token: string): number {
    const { exp } = decode(token) as { [exp: string]: number };
    return exp;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
