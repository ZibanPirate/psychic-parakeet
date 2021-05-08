import "reflect-metadata";

import {
  RoutingControllersOptions,
  createExpressServer,
  useContainer,
} from "routing-controllers";
import { Application } from "express";
import { AuthorizationMiddleware } from "./middlewares/authorization";
import { ConfigService } from "../config/service";
import Container from "typedi";
import { DocsMiddleware } from "./middlewares/docs";
import { ErrorMiddleware } from "./middlewares/error";
import { LoggerMiddleware } from "./middlewares/logger";
import { OmdbApiController } from "../omdbapi/controller";
import { SecurityMiddleware } from "./middlewares/security";
import { runCronJobs } from "./cron-jobs/setup";

// Use typedi container
useContainer(Container);

// Create the app:
export const routingControllersOptions: RoutingControllersOptions = {
  controllers: [OmdbApiController],
  middlewares: [
    // middlewares:
    SecurityMiddleware,
    ErrorMiddleware,
    LoggerMiddleware,
    DocsMiddleware,
  ],
  defaultErrorHandler: false,
  cors: Container.get(SecurityMiddleware).cors(),
  authorizationChecker: Container.get(AuthorizationMiddleware)
    .authorizationChecker,
};
const app: Application = createExpressServer(routingControllersOptions);

const { NODE_ENV, PORT } = Container.get(ConfigService).env();

app.listen(PORT, () => {
  console.log(
    `Example app listening at ${
      NODE_ENV === "development" ? "http://localhost:" : "port: "
    }${PORT}`,
  );
});

runCronJobs();
