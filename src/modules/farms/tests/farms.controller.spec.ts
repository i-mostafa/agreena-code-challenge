/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import http, { Server } from "http";
import ds from "orm/orm.config";
import supertest, { SuperAgentTest } from "supertest";
import { CreateFarmDto } from "../dto/create-farm.dto";
import { AuthService } from "modules/auth/auth.service";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { ResponseStatus } from "helpers/enums";
import { SuccessResponse } from "helpers/success-response";
import { Farm } from "../entities/farm.entity";

describe("UsersController", () => {
  let app: Express;
  let agent: SuperAgentTest;
  let server: Server;
  let authService: AuthService;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();
    agent = supertest.agent(app);
    authService = new AuthService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe("POST /farms", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };

    it("should create new farm", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(201);
      expect(res.body).toMatchObject({
        data: {
          id: expect.any(String),
          address: expect.stringMatching(createFarmDto.address) as string,
          size: expect.any(Number),
          yield: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        status: ResponseStatus.SUCCESS,
      });
    });
    it("should return un authorized", async () => {
      const res = await agent.post("/api/v1/farms").send(createFarmDto);

      expect(res.statusCode).toBe(401);
      expect(res.body).toMatchObject({
        message: "Not Authorized",
      });
    });
  });
  describe("Patch /farms/:id", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };

    it("should update the farm", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const updateResponse = await agent
        .patch(`/api/v1/farms/${farm.id}`)
        .send({ name: "test2" })
        .set("Authorization", `Bearer ${token}`);

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body).toMatchObject({
        data: {
          id: expect.any(String),
          name: "test2",
          address: expect.stringMatching(createFarmDto.address) as string,
          size: expect.any(Number),
          yield: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        status: ResponseStatus.SUCCESS,
      });
    });
    it("should return un authorized", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const updateResponse = await agent.patch(`/api/v1/farms/${farm.id}`).send({ name: "test2" });

      expect(updateResponse.statusCode).toBe(401);
      expect(updateResponse.body).toMatchObject({
        message: "Not Authorized",
      });
    });
  });
  describe("Get /farms/:id", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };

    it("should find farm with id", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const foundResponse = await agent.get(`/api/v1/farms/${farm.id}`).set("Authorization", `Bearer ${token}`);

      expect(foundResponse.statusCode).toBe(200);
      expect(foundResponse.body).toMatchObject({
        data: farm,
        status: ResponseStatus.SUCCESS,
      });
    });
    it("should return un authorized", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const res2 = await agent.get(`/api/v1/farms/${farm.id}`);

      expect(res2.statusCode).toBe(401);
      expect(res2.body).toMatchObject({
        message: "Not Authorized",
      });
    });
  });

  describe("Delete /farms/:id", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };

    it("should delete the farm", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const foundResponse = await agent.delete(`/api/v1/farms/${farm.id}`).set("Authorization", `Bearer ${token}`);
      const { id, ...farmData } = farm;
      expect(foundResponse.statusCode).toBe(200);
      expect(foundResponse.body).toMatchObject({
        data: farmData,
        status: ResponseStatus.SUCCESS,
      });
    });
    it("should return un authorized", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const farm = (res.body as SuccessResponse).data as Farm;

      const res2 = await agent.delete(`/api/v1/farms/${farm.id}`);

      expect(res2.statusCode).toBe(401);
      expect(res2.body).toMatchObject({
        message: "Not Authorized",
      });
    });
  });

  describe("Get All /farms/", () => {
    const createUserDto: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const createFarmDto: CreateFarmDto = { name: "test", address: "Euless", size: 23.4, yield: 23.5 };
    const createFarmDto1: CreateFarmDto = { name: "test1", address: "Tulsa", size: 45.4, yield: 11.5 };
    const createFarmDto2: CreateFarmDto = { name: "test2", address: "Wichita Falls", size: 126.4, yield: 1223.5 };

    it("should get all farms", async () => {
      const { token } = await authService.register(createUserDto);
      const res = await agent.post("/api/v1/farms").send(createFarmDto).set("Authorization", `Bearer ${token}`);
      const res1 = await agent.post("/api/v1/farms").send(createFarmDto1).set("Authorization", `Bearer ${token}`);
      const res2 = await agent.post("/api/v1/farms").send(createFarmDto2).set("Authorization", `Bearer ${token}`);

      const farm = (res.body as SuccessResponse).data as Farm;
      const farm1 = (res1.body as SuccessResponse).data as Farm;
      const farm2 = (res2.body as SuccessResponse).data as Farm;

      const foundResponse = await agent.get(`/api/v1/farms/`).set("Authorization", `Bearer ${token}`);

      expect(foundResponse.statusCode).toBe(200);
      expect(foundResponse.body).toMatchObject({
        data: [farm, farm1, farm2],
        status: ResponseStatus.SUCCESS,
      });
    });
    it("should return un authorized", async () => {
      const res = await agent.get(`/api/v1/farms/`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toMatchObject({
        message: "Not Authorized",
      });
    });
  });
});
