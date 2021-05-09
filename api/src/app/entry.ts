import "reflect-metadata";

import { Application } from "express";
import { ConfigService } from "../config/service";
import Container from "typedi";
import { createExpressServer } from "routing-controllers";
import { routingControllersOptions } from "./middlewares";
import { runCronJobs } from "./cron-jobs/setup";
import { setupDB } from "./database/setup";

const bootstrap = async () => {
  const { NODE_ENV, PORT, DB_URI } = Container.get(ConfigService).env();
  await setupDB(DB_URI);

  const app: Application = createExpressServer(routingControllersOptions);

  app.listen(PORT, async () => {
    console.log(
      `API listening at ${
        NODE_ENV === "development" ? "http://localhost:" : "port: "
      }${PORT}`,
    );
  });

  await runCronJobs();
};

bootstrap();
