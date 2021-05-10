import { OmdbApiSearchResponse, OmdbApiService } from "./service";
import { envMock, generateOmdbRecordBatchMock } from "../../test/mocks";
import Axios from "axios";
import { ConfigService } from "../config/service";
import Cron from "cron";
import { MovieRepository } from "../movie/repository";
import { PullOmdbDataCronJob } from "./cron-job";
import { SearchService } from "../search/service";
import { mock } from "jest-mock-extended";
import typeDIContainer from "typedi";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;
jest.mock("cron");
const mockedCron = Cron as jest.Mocked<typeof Cron>;
jest.mock("dotenv", () => ({ config: () => ({ parsed: envMock }) }));

jest.mock("redis-modules-sdk", () => ({
  Redisearch: class Redisearch {
    public connect = jest.fn().mockResolvedValue({});
    public create = jest.fn().mockResolvedValue({});
    public sendCommand = jest.fn().mockResolvedValue({});
  },
}));

describe("PullOmdbDataCronJob", () => {
  const configService = typeDIContainer.get(ConfigService);
  const omdbApiService = new OmdbApiService(configService);
  const searchService = new SearchService(configService);

  const omdbRecordBatchMock = generateOmdbRecordBatchMock(0, 10);
  const movieRepository = mock<MovieRepository>();

  it("should create a cron job", async () => {
    const pullOmdbDataCronJob = new PullOmdbDataCronJob(
      omdbApiService,
      (movieRepository as unknown) as MovieRepository,
      searchService,
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
      searchService,
    );
    await pullOmdbDataCronJob.run();

    expect(mockedAxios.get).toBeCalledTimes(20 / 10 + 20);
    expect(movieRepository.save).toBeCalledTimes(20 / 10);
  });
});
