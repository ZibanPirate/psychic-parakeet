import { OmdbApiSearchResponse, OmdbApiService } from "./service";
import { configEnvMock, generateOmdbRecordBatchMock } from "../../test/mocks";
import Axios from "axios";
import { ConfigService } from "../config/service";
import Cron from "cron";
import MockDate from "mockdate";
import { PullOmdbDataCronJob } from "./cron-job";
import { mock } from "jest-mock-extended";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
jest.mock("cron");
const mockedCron = Cron as jest.Mocked<typeof Cron>;

describe("PullOmdbDataCronJob", () => {
  const mockedConfigServiceInstance = mock<ConfigService>();
  mockedConfigServiceInstance.env.mockReturnValue(configEnvMock);
  const omdbApiService = new OmdbApiService(mockedConfigServiceInstance);
  const omdbRecordBatchMock = generateOmdbRecordBatchMock(0, 10);

  afterAll(() => {
    MockDate.reset();
  });

  it("should crate a cron job", async () => {
    const pullOmdbDataCronJob = new PullOmdbDataCronJob(omdbApiService);

    expect(pullOmdbDataCronJob.start).not.toThrow();
    expect(mockedCron.CronJob.mock.instances[0].start).toBeCalled();
  });

  it("should pull data from omdbapi.com and save it to database", async () => {
    const currentYear = 2020;
    MockDate.set(`${currentYear}`);
    mockedAxios.get.mockResolvedValue({
      data: {
        Response: "True",
        Search: omdbRecordBatchMock,
        totalResults: "20",
      } as OmdbApiSearchResponse,
    });
    const pullOmdbDataCronJob = new PullOmdbDataCronJob(omdbApiService);
    await pullOmdbDataCronJob.run();

    expect(mockedAxios.get).toBeCalledTimes(
      ((currentYear - PullOmdbDataCronJob.fromYear + 1) * 20) / 10,
    );
  });
});
