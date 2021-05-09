import Container from "typedi";
import { PullOmdbDataCronJob } from "../../omdbapi/cron-job";
import { toString } from "cronstrue";

const jobs = [PullOmdbDataCronJob];

export const runCronJobs = async () => {
  console.log("Running cron-jobs ...");
  jobs.forEach(async (JobClass) => {
    const { time, name, start } = Container.get(JobClass);
    start();
    console.log(`CRON [${toString(time)}] : ${name}`);
  });
};
