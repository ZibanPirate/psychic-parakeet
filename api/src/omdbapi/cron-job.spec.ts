import Cron from "cron";
import { PullOmdbDataCronJob } from "./cron-job";

jest.mock("cron");
const mockedCron = Cron as jest.Mocked<typeof Cron>;

describe("PullOmdbDataCronJob", () => {
  it("should crate a cron job", async () => {
    const pullOmdbDataCronJob = new PullOmdbDataCronJob();

    expect(pullOmdbDataCronJob.start).not.toThrow();
    expect(mockedCron.CronJob.mock.instances[0].start).toBeCalled();
  });

  it("should pull data from omdbapi.com and save it to database", async () => {
    const pullOmdbDataCronJob = new PullOmdbDataCronJob();

    expect(pullOmdbDataCronJob.run).not.toThrow();
  });
});
