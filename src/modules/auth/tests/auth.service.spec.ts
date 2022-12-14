import config from "config/config";
import { Express } from "express";
import { setupServer } from "server/server";
import { disconnectAndClearDatabase } from "helpers/utils";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersService } from "modules/users/users.service";
import ds from "orm/orm.config";
import { AuthService } from "../auth.service";
import { LoginUserDto } from "../dto/login-user.dto";
import http, { Server } from "http";
import { NotAuthorizedError } from "errors/not-authorized.error";

describe("AuthService", () => {
  let app: Express;
  let usersService: UsersService;
  let authService: AuthService;
  let server: Server;

  beforeAll(() => {
    app = setupServer();
    server = http.createServer(app).listen(config.APP_PORT);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    await ds.initialize();

    usersService = new UsersService();
    authService = new AuthService();
  });

  afterEach(async () => {
    await disconnectAndClearDatabase(ds);
  });

  describe(".login", () => {
    const userData: CreateUserDto = { email: "user@test.com", password: "password", address: "Euless" };
    const loginDto: LoginUserDto = { email: "user@test.com", password: "password" };
    const createUser = async (userDto: CreateUserDto) => usersService.createUser(userDto);

    it("should create access token for existing user", async () => {
      await createUser(userData);

      const { token } = await authService.login(loginDto);

      expect(token).toBeDefined();
    });

    it("should throw ValidationError when user logs in with invalid email", async () => {
      await authService.login({ email: "invalidEmail", password: "pwd" }).catch((error: NotAuthorizedError) => {
        expect(error).toBeInstanceOf(NotAuthorizedError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });

    it("should throw NotAuthorizedError when user logs in with invalid password", async () => {
      await createUser(userData);

      await authService.login({ email: loginDto.email, password: "invalidPassword" }).catch((error: NotAuthorizedError) => {
        expect(error).toBeInstanceOf(NotAuthorizedError);
        expect(error.message).toBe("Invalid user email or password");
      });
    });
  });
});
