import {
  ExpressErrorMiddlewareInterface,
  Middleware,
} from "routing-controllers";
import { ErrorRequestHandler } from "express";
import { GeneralResponse } from "../types";
import { Service } from "typedi";

@Service()
@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  error: ErrorRequestHandler<never, GeneralResponse, unknown> = (
    err,
    req,
    res,
    next,
  ) => {
    // Logs error
    console.log({
      message: "Internal Server Error",
      error: err?.message,
    });

    // Skip if headers are already sent
    if (res.headersSent) {
      return next(err);
    }

    // return a general error response
    return res.status(500).json({
      code: 500,
      msg: err?.message,
    });
  };
}