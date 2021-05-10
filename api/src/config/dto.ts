import { Length, Matches } from "class-validator";

const environment: Environment[] = ["development", "production", "test"];

export class ENV {
  PORT = 7070; // default port is 7070

  @Matches("(" + environment.join(")|(") + ")")
  NODE_ENV: Environment = "development"; // default environment is development

  @Length(8, 8)
  OMDBAPI_API_KEY!: string;

  @Length(8)
  MANUAL_CRON_JOB_EXECUTION_TOKEN!: string;

  @Length(8)
  DB_URI!: string;

  @Length(8)
  SEARCH_DB_URI!: string;
}

export type DotEnv = Record<keyof ENV, string>;

// no stage environment cuz it's just a coding-challenge ;)
type Environment = "development" | "production" | "test";
