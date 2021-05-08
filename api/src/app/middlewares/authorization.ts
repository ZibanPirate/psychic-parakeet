import { Authorized as Authed } from "routing-controllers";
import { AuthorizationChecker } from "routing-controllers/types/AuthorizationChecker";
import { ConfigService } from "../../config/service";
import { Request } from "express";
import { Role } from "../types";
import { Service } from "typedi";

@Service()
export class AuthorizationMiddleware {
  constructor(private configService: ConfigService) {}

  public authorizationChecker: AuthorizationChecker = async (
    action,
    roles: Role[],
  ) => {
    if (roles.find((role) => role === "CRON_JOB")) {
      return (
        (action.request as Request).headers.authorization ===
        `Bearer ${this.configService.env().MANUAL_CRON_JOB_EXECUTION_TOKEN}`
      );
    }

    return false;
  };
}

export const Authorized = (roles: Role | Role[]) => Authed(roles);
