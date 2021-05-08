import { ConfigService } from "./service";
import { ENVDto } from "./dto";
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
    mockedDotenv.config.mockReturnValue({ parsed: { NODE_ENV: "testing" } });

    expect(() => new ConfigService()).toThrowError(
      `⚠️  Errors in .env file in the following keys:\nNODE_ENV : {\"matches\":\"NODE_ENV must match (development)|(production) regular expression\"}`,
    );
  });

  it("should throw error when .env has no OMDBAPI_API_KEY key or its value is null", async () => {
    mockedDotenv.config.mockReturnValue({ parsed: { NODE_ENV: "testing" } });

    expect(() => new ConfigService()).toThrowError(
      `⚠️  Errors in .env file in the following keys:\nNODE_ENV : {\"matches\":\"NODE_ENV must match (development)|(production) regular expression\"}\nOMDBAPI_API_KEY : {\"isLength\":\"OMDBAPI_API_KEY must be longer than or equal to 8 characters\"}`,
    );
  });

  it("should return default envs when their keys don't exist on .env", async () => {
    mockedDotenv.config.mockReturnValue({
      parsed: { OMDBAPI_API_KEY: "12345678" },
    });
    process.env = { NODE_ENV: "development" };

    const configService = new ConfigService();
    expect(configService).toBeInstanceOf(ConfigService);
    expect(configService.env()).toMatchObject<ENVDto>({
      NODE_ENV: "development",
      PORT: 7070,
      OMDBAPI_API_KEY: "12345678",
    });
  });
});