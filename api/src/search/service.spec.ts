import { ConfigService } from "../config/service";
import { SearchService } from "./service";
import { envMock } from "../../test/mocks";
import { mock } from "jest-mock-extended";

jest.mock("redis-modules-sdk", () => ({
  Redisearch: class Redisearch {
    public connect = jest.fn().mockResolvedValue({});
    public create = jest.fn().mockRejectedValue("test-error");
  },
}));

describe("SearchService", () => {
  const mockedConfigServiceInstance = mock<ConfigService>();
  mockedConfigServiceInstance.env.mockReturnValue(envMock);

  describe("setupDB", () => {
    it("connect and skip index creation if it does exist", async () => {
      const searchService = new SearchService(mockedConfigServiceInstance);

      await expect(searchService.setupDB()).rejects.toBe("test-error");
    });
  });
});
