import { dotEnvMock, envMock } from "../../test/mocks";
import { ConfigService } from "./service";
import { ENV } from "./dto";
import dotenv from "dotenv";

jest.mock("dotenv");
const mockedDotenv = dotenv as jest.Mocked<typeof dotenv>;

let OLD_ENV: NodeJS.ProcessEnv;
describe("ConfigService", () => {
  beforeAll(() => {
    OLD_ENV = Object.assign({}, process.env);
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should throw error when .env has invalid key value pair", async () => {
    mockedDotenv.config.mockReturnValue({
      parsed: { ...dotEnvMock, NODE_ENV: "dwdw" },
    });

    expect(() => new ConfigService()).toThrowError(
      `⚠️  Errors in .env file in the following keys:\nNODE_ENV : {\"matches\":\"NODE_ENV must match (development)|(production)|(test) regular expression\"}`,
    );
  });

  it("should throw error when .env doesn't have at least one Required key or its value is null", async () => {
    mockedDotenv.config.mockReturnValue({ parsed: { NODE_ENV: "testing" } });

    expect(() => new ConfigService()).toThrow();
  });

  it("should return default envs when their keys don't exist on .env", async () => {
    mockedDotenv.config.mockReturnValue({
      parsed: {
        OMDBAPI_API_KEY: "12345678",
        MANUAL_CRON_JOB_EXECUTION_TOKEN: "test-token",
        DB_URI: "test-uri",
        SEARCH_DB_URI: "test-search-uri",
      },
    });
    process.env = { NODE_ENV: "development" };

    const configService = new ConfigService();
    expect(configService).toBeInstanceOf(ConfigService);
    expect(configService.env()).toMatchObject<ENV>(envMock);
  });
});
