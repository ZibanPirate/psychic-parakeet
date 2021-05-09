import { OmdbApiSearchResponse, OmdbApiService } from "./service";
import { configEnvMock, generateOmdbRecordBatchMock } from "../../test/mocks";
import Axios from "axios";
import { ConfigService } from "../config/service";
import Cron from "cron";
import { MovieRepository } from "../movie/repository";
import { PullOmdbDataCronJob } from "./cron-job";
import { mock } from "jest-mock-extended";
import { setupDB } from "../app/database/setup";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
jest.mock("cron");
const mockedCron = Cron as jest.Mocked<typeof Cron>;

describe("PullOmdbDataCronJob", () => {
  setupDB("postgresql://test:test@localhost:6161/test");

  const mockedConfigServiceInstance = mock<ConfigService>();
  mockedConfigServiceInstance.env.mockReturnValue(configEnvMock);
  const omdbApiService = new OmdbApiService(mockedConfigServiceInstance);
  const omdbRecordBatchMock = generateOmdbRecordBatchMock(0, 10);
  const movieRepository = mock<MovieRepository>();

  beforeAll(() => {
    jest.clearAllMocks();
    mockedAxios.get.mockClear();
  });

  it("should create a cron job", async () => {
    const pullOmdbDataCronJob = new PullOmdbDataCronJob(
      omdbApiService,
      (movieRepository as unknown) as MovieRepository,
    );

    expect(pullOmdbDataCronJob.start).not.toThrow();
    expect(mockedCron.CronJob.mock.instances[0].start).toBeCalled();
  });

  it("should pull data from omdbapi.com and save it to database", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        Response: "True",
        Search: omdbRecordBatchMock,
        totalResults: "20",
      } as OmdbApiSearchResponse,
    });
    const pullOmdbDataCronJob = new PullOmdbDataCronJob(
      omdbApiService,
      (movieRepository as unknown) as MovieRepository,
    );
    await pullOmdbDataCronJob.run();

    expect(mockedAxios.get).toBeCalledTimes(20 / 10 + 20);
    expect(movieRepository.save).toBeCalledTimes(20 / 10);
  });
});
