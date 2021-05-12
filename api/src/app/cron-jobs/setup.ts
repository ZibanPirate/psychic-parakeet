import Container from "typedi";
import { LoggerService } from "../../logger/service";
import { PullOmdbDataCronJob } from "../../omdbapi/cron-job";
import { toString } from "cronstrue";

const jobs = [PullOmdbDataCronJob];

export const runCronJobs = async () => {
  const loggerService = Container.get(LoggerService);
  loggerService.info({ message: `Starting cron-jobs ...` });
  jobs.forEach(async (JobClass) => {
    const { time, name, start } = Container.get(JobClass);
    start();
    loggerService.info({ message: `CRON [${toString(time)}] : ${name}` });
  });
};
