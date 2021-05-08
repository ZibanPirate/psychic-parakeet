import Cron from "cron";
import { CronJob } from "../app/cron-jobs/types";
import { Service } from "typedi";

@Service()
export class PullOmdbDataCronJob implements CronJob {
  public time = "* * * * *";
  public name = "Pulling data from omdbapi.com";

  public run = async () => {
    const d = new Date();
    console.log("TIME: ", d);
  };

  public start = () => {
    new Cron.CronJob(this.time, this.run).start();
  };
}
