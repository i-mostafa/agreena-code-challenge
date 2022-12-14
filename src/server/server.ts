import express, { Express, Response } from "express";
import morgan from "morgan";
import { handleErrorMiddleware } from "middlewares/error-handler.middleware";
import routes from "routes";
import { authGuard } from "middlewares/authGuard.middleware";
import config from "config/config";
import { routNotFoundHandler } from "middlewares/route-not-found.middleware";

export function setupServer(): Express {
  const app = express();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", authGuard, (_, res: Response) => {
    res.send(`Listening on: ${config.APP_HOST}:${config.APP_PORT}`);
  });

  app.use("/api", routes);
  app.use(routNotFoundHandler);
  app.use(handleErrorMiddleware);

  return app;
}
