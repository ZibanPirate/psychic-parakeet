import { RoutingControllersOptions, useContainer } from "routing-controllers";
import { AuthorizationMiddleware } from "./authorization";
import Container from "typedi";
import { DocsMiddleware } from "./docs";
import { ErrorMiddleware } from "./error";
import { HealthController } from "../../health/controller";
import { LoggerMiddleware } from "./logger";
import { OmdbApiController } from "../../omdbapi/controller";
import { SearchController } from "../../search/controller";
import { SecurityMiddleware } from "./security";

// Use typedi container
useContainer(Container);

export const routingControllersOptions: RoutingControllersOptions = {
  controllers: [OmdbApiController, SearchController, HealthController],
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
