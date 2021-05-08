import { Length, Matches } from "class-validator";

const environment: Environment[] = ["development", "production"];

export class ENVDto {
  PORT = 7070; // default port is 7070

  @Matches("(" + environment.join(")|(") + ")")
  NODE_ENV: Environment = "development"; // default environment is development

  @Length(8, 8)
  OMDBAPI_API_KEY!: string;
}

// no stage environment cuz it's just a coding-challenge ;)
type Environment = "development" | "production";