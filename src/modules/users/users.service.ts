import * as bcrypt from "bcrypt";
import config from "config/config";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import dataSource from "orm/orm.config";
import { GoogleMapsClient } from "helpers/google-maps";
import { BadRequestError } from "errors/bad-request.error";

export class UsersService {
  private readonly usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = dataSource.getRepository(User);
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    const { email, password, ...rest } = data;

    const existingUser = await this.findOneBy({ email });
    if (existingUser) throw new BadRequestError("A user for the email already exists");

    const hashedPassword = await this.hashPassword(password);

    const coordinates = await GoogleMapsClient.getCoordinates(data.address);

    const userData: DeepPartial<User> = { hashedPassword, email, ...rest, coordinates };

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  public async findOneBy(param: FindOptionsWhere<User>): Promise<User | null> {
    return this.usersRepository.findOneBy({ ...param });
  }

  private async hashPassword(password: string, salt_rounds = config.SALT_ROUNDS): Promise<string> {
    const salt = await bcrypt.genSalt(salt_rounds);
    return bcrypt.hash(password, salt);
  }
}
