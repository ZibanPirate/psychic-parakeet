import {
  OmdbApiSearchParams,
  OmdbApiSearchResponse,
  OmdbApiService,
} from "./service";
import { configEnvMock, generateOmdbRecordBatchMock } from "../../test/mocks";
import Axios from "axios";
import { ConfigService } from "../config/service";
import { mock } from "jest-mock-extended";

jest.mock("axios");
const mockedAxios = Axios as jest.Mocked<typeof Axios>;

describe("OmdbApiService", () => {
  const omdbRecordBatchMock = generateOmdbRecordBatchMock(0, 10);
  const mockedConfigServiceInstance = mock<ConfigService>();
  mockedConfigServiceInstance.env.mockReturnValue(configEnvMock);

  const omdbApiSearchParams: OmdbApiSearchParams = {
    query: "space",
  };

  it("throw an error on omdiapi api failure", async () => {
    mockedAxios.get.mockResolvedValue({
      data: { Response: "False" } as OmdbApiSearchResponse,
    });
    const omdbApiService = new OmdbApiService(mockedConfigServiceInstance);

    expect(omdbApiService.search(omdbApiSearchParams)).rejects.toThrowError(
      "OmdbApi.com API failure",
    );
    expect(mockedAxios.get).toBeCalledWith(
      `http://www.omdbapi.com/?apiKey=${configEnvMock.OMDBAPI_API_KEY}&s=${omdbApiSearchParams.query}`,
    );
  });

  it("returns omdbRecords and count when everything goes well", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        Response: "True",
        search: omdbRecordBatchMock,
        totalResults: "100",
      } as OmdbApiSearchResponse,
    });
    const omdbApiService = new OmdbApiService(mockedConfigServiceInstance);

    const response = await omdbApiService.search({
      ...omdbApiSearchParams,
      page: 1,
      type: "movie",
      year: 233,
    });

    expect(response).toMatchObject({
      count: 100,
      omdbRecords: omdbRecordBatchMock,
    });
    expect(mockedAxios.get).toBeCalledWith(
      `http://www.omdbapi.com/?apiKey=${configEnvMock.OMDBAPI_API_KEY}&s=${omdbApiSearchParams.query}&type=movie&y=233&page=1`,
    );
  });
});
