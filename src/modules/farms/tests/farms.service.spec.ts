/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { Farm } from "../entities/farm.entity";
import { FarmsService } from "../farms.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import { ForbiddenError } from "errors/forbidden.error";

describe("UsersController", () => {
  let app: Express;
  let server: Server;

  let farmsService: FarmsService;
  let usersService: UsersService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    farmsService = new FarmsService();
    usersService = new UsersService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".createFarm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };
    it("should create new farm", async () => {
      const user = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);
      expect(createdFarm).toBeInstanceOf(Farm);
    });
  });
  describe(".update farm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createUserDto2: CreateUserDto = { email: "user2@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };
    it("should update farm", async () => {
      const user = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);

      const updatedFarm = await farmsService.updateFarm({ id: createdFarm.id }, { name: "test2" }, user);

      expect(updatedFarm).toMatchObject({
        ...createdFarm,
        name: "test2",
        updatedAt: expect.any(Date),
      });
    });
    it("should return not allowed", async () => {
      const user = await usersService.createUser(createUserDto);
      const user2 = await usersService.createUser(createUserDto2);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);

      await farmsService.updateFarm({ id: createdFarm.id }, { name: "test2" }, user2).catch(error => {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as ForbiddenError).message).toBe("You are not the owner of this farm");
      });
    });
  });
  describe(".findOne", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };
    it("should find a farm", async () => {
      const user = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);
      const farm = await farmsService.findOne({ where: { id: createdFarm.id } });
      const { owner, ...farmData } = createdFarm;
      expect(farm).toMatchObject(farmData);
    });
  });

  describe(".delete farm", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createUserDto2: CreateUserDto = { email: "user2@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };
    it("should delete farm", async () => {
      const user = await usersService.createUser(createUserDto);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);

      const deletedFarm = await farmsService.deleteFarm({ id: createdFarm.id }, user);
      const { id, ...farmData } = createdFarm;
      expect(deletedFarm).toMatchObject({
        ...farmData,
        updatedAt: expect.any(Date),
      });
    });
    it("should return not allowed", async () => {
      const user = await usersService.createUser(createUserDto);
      const user2 = await usersService.createUser(createUserDto2);

      const createdFarm = await farmsService.createFarm(createFarmDto, user);

      await farmsService.deleteFarm({ id: createdFarm.id }, user2).catch(error => {
        expect(error).toBeInstanceOf(ForbiddenError);
        expect((error as ForbiddenError).message).toBe("You are not the owner of this farm");
      });
    });
  });
});
