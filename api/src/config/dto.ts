import { Matches } from "class-validator";

const environment: Environment[] = ["development", "production"];

export class ENVDto {
  PORT = 7070; // default port is 7070

  @Matches("(" + environment.join(")|(") + ")")
  NODE_ENV: Environment = "development"; // default environment is development
}

// no stage environment cuz it's just a coding-challenge ;)
type Environment = "development" | "production";
