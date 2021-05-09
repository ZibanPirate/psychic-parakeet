import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { RequestHandler } from "express";
import { Service } from "typedi";

@Service()
@Middleware({ type: "after" })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  use: RequestHandler = (req, res, next) => {
    console.log({
      message: `${res.statusCode} ${req.method} ${req.url}`,
    });
    next();
  };
}
