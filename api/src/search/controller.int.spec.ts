import { envMock, generateMovieEntityBatchMock } from "../../test/mocks";
import { MovieEntity } from "../app/database/entity/movie";
import { MovieRepository } from "../movie/repository";
import { SearchController } from "./controller";
import { SearchMoviesResponse } from "./types";
import { SearchService } from "./service";
import typeDIContainer from "typedi";
import { Container as typeORMContainer } from "typeorm-typedi-extensions";

const movieEntityBatchMock = generateMovieEntityBatchMock(1, 2);

jest.mock("redis-modules-sdk", () => ({
  Redisearch: class Redisearch {
    public connect = jest.fn().mockResolvedValue({});
    public search = jest
      .fn()
      .mockResolvedValue([2, "movie:1", [], "movie:2", []]);
  },
}));
jest.mock("dotenv", () => ({ config: () => ({ parsed: envMock }) }));
jest.mock("typeorm", () => ({
  PrimaryColumn: jest.fn(),
  Column: jest.fn(),
  Entity: jest.fn(),
  EntityRepository: jest.fn(),
  Repository: class Repository {
    public findOneOrFail = async ({ id }: MovieEntity) =>
      movieEntityBatchMock[Number(id) - 1];
  },
}));
describe("SearchController", () => {
  const searchServiceInstance = typeDIContainer.get(SearchService);
  const movieRepository = typeORMContainer.get(MovieRepository);

  it("should return 200 with success message and records array", async () => {
    const query = "space";

    const searchController = new SearchController(
      searchServiceInstance,
      movieRepository,
    );

    const response = await searchController.searchMovies(query);

    expect(response).toMatchObject<SearchMoviesResponse>({
      movies: movieEntityBatchMock,
      code: 200,
      msg: `Found ${movieEntityBatchMock.length} results`,
    });
  });
});
