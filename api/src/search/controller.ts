import { Controller, Get, QueryParam } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { MovieEntity } from "../app/database/entity/movie";
import { MovieRepository } from "../movie/repository";
import { SearchMoviesResponse } from "./types";
import { SearchService } from "./service";
import { Service } from "typedi";
import { sanitize } from "string-sanitizer";

@Service()
@Controller("/Search")
export class SearchController {
  constructor(
    private searchService: SearchService,
    @InjectRepository(MovieEntity) private movieRepository: MovieRepository,
  ) {}

  @Get("/Movies")
  @OpenAPI({
    summary: "Search for Movies by title, director and plot",
  })
  @ResponseSchema(SearchMoviesResponse)
  public async searchMovies(
    @QueryParam("query") query: string,
  ): Promise<SearchMoviesResponse> {
    const redisearch = sanitize
      .keepSpace(query)
      .split(" ")
      .reduce((pV, cV) => (cV ? `${pV ? pV + " " : ""}%${cV}%` : ""), "");

    const { count, records } = await this.searchService.search(
      "moviesIndex",
      redisearch,
    );

    const movies = await Promise.all(
      records.map((record) =>
        this.movieRepository.findOneOrFail({ id: record.id.substr(6) }),
      ),
    );

    return {
      movies,
      code: 200,
      msg: `Found ${count} results`,
    };
  }
}
