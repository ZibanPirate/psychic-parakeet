import "reflect-metadata";

import { Application } from "express";
import { ConfigService } from "../config/service";
import Container from "typedi";
import { LoggerService } from "../logger/service";
import { SearchService } from "../search/service";
import { createExpressServer } from "routing-controllers";
import { routingControllersOptions } from "./middlewares";
import { runCronJobs } from "./cron-jobs/setup";
import { setupDB } from "./database/setup";

const bootstrap = async () => {
  const { NODE_ENV, PORT, DB_URI } = Container.get(ConfigService).env();
  await setupDB(DB_URI);
  await Container.get(SearchService).setupDB();
  const loggerService = Container.get(LoggerService);

  const app: Application = createExpressServer(routingControllersOptions);

  app.listen(PORT, async () => {
    loggerService.info({
      message: `API listening at ${
        NODE_ENV === "development" ? "http://localhost:" : "port: "
      }${PORT}`,
    });
  });

  await runCronJobs();
};

bootstrap();
