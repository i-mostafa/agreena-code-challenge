import config from "config/config";
import http from "http";

import dataSource from "orm/orm.config";
import { setupServer } from "./server/server";

async function bootstrap(): Promise<http.Server> {
  const app = setupServer();

  await dataSource.initialize();
  const port = config.APP_PORT;

  const server = http.createServer(app);
  server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

  return server;
}

bootstrap();
