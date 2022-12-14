import { faker } from "@faker-js/faker";
import { CreateFarmDto } from "modules/farms/dto/create-farm.dto";
import { User } from "modules/users/entities/user.entity";
import { FarmsService } from "modules/farms/farms.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";

import dataSource from "orm/orm.config";
import { plainToInstance } from "class-transformer";

const farmsService = new FarmsService();
const usersService = new UsersService();

const createFarm = async (owner: User) => {
  const farmData = plainToInstance(
    CreateFarmDto,
    {
      name: faker.name.fullName(),
      size: faker.datatype.float(),
      yield: faker.datatype.float(),
      address: faker.address.cityName(),
    },
    {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    },
  );

  return farmsService.createFarm(farmData, owner);
};

const createUser = async () => {
  const userData = plainToInstance(
    CreateUserDto,
    {
      email: faker.internet.email(),
      password: faker.random.alphaNumeric(8),
      address: faker.address.cityName(),
    },
    {
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    },
  );

  return usersService.createUser(userData);
};

const seeder = async (numberOfUsers: number = 4, numberOfFarmsForEachUser: number = 4) => {
  await dataSource.initialize();

  while (numberOfUsers--) {
    try {
      const user = await createUser();
      const farms = [];
      while (farms.length < numberOfFarmsForEachUser) {
        try {
          const farm = await createFarm(user);
          farms.push(farm);
        } catch (e) {
          console.log((e as Error).message);
        }
      }
      console.log("new user seeded", user, farms);
    } catch (e) {
      console.log((e as Error).message);
    }
  }
};

seeder().then(() => {
  console.log("done");
  process.exit(0);
});
