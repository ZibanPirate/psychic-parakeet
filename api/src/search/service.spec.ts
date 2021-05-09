import { ConfigService } from "../config/service";
import { SearchService } from "./service";
import { configEnvMock } from "../../test/mocks";
import { mock } from "jest-mock-extended";

jest.mock("redis-modules-sdk", () => ({
  Redisearch: class Redisearch {
    public connect = jest.fn().mockResolvedValue({});
    public create = jest
      .fn()
      .mockRejectedValue("Error: Redisearch: ReplyError: Index already exists");
  },
}));

describe("SearchService", () => {
  const mockedConfigServiceInstance = mock<ConfigService>();
  mockedConfigServiceInstance.env.mockReturnValue(configEnvMock);

  describe("setupDB", () => {
    it("connect and skip index creation if it does exist", async () => {
      const searchService = new SearchService(mockedConfigServiceInstance);

      await expect(searchService.setupDB()).resolves.toBeUndefined();
    });
  });
});
