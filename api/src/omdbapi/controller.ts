import { Controller, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Authorized } from "../app/middlewares/authorization";
import { GeneralResponse } from "../app/types";
import { PullOmdbDataCronJob } from "./cron-job";
import { Service } from "typedi";

@Service()
@Controller("/OmdbApi")
export class OmdbApiController {
  constructor(private readonly pullOmdbDataCronJob: PullOmdbDataCronJob) {}

  @Authorized("CRON_JOB")
  @Post("/PullDataManually")
  @OpenAPI({
    summary: "Run cron job manually",
  })
  @ResponseSchema(GeneralResponse)
  public async pullDataManually(): Promise<GeneralResponse> {
    this.pullOmdbDataCronJob.run();

    return {
      code: 200,
      msg: "Job-Run Triggered Successfully",
    };
  }
}
