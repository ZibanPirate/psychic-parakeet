import Cron from "cron";
import { CronJob } from "../app/cron-jobs/types";
import { InjectRepository } from "typeorm-typedi-extensions";
import { LoggerService } from "../logger/service";
import { MovieEntity } from "../app/database/entity/movie";
import { MovieRepository } from "../movie/repository";
import { OmdbApiService } from "./service";
import { SearchService } from "../search/service";
import { Service } from "typedi";
import { toString } from "cronstrue";

@Service()
export class PullOmdbDataCronJob implements CronJob {
  constructor(
    private omdbApiService: OmdbApiService,
    @InjectRepository(MovieEntity) private movieRepository: MovieRepository,
    private searchService: SearchService,
    private loggerService: LoggerService,
  ) {}

  public time = "00 00 00 * * *";
  public name = "Pulling data from omdbapi.com";

  public static fromYear = 2001;

  public run = async () => {
    let totalCount = 0;
    const recordsPerPage = 10;
    const fromYear = PullOmdbDataCronJob.fromYear;
    const toYear = 2001;
    this.loggerService.info({
      message: `RUNNING CRON [${toString(this.time)}] : ${this.name}`,
    });
    for (let year = fromYear; year <= toYear; year++) {
      let count = 0;
      let page = 0;
      do {
        page++;
        const response = await this.omdbApiService.search({
          query: "space",
          page,
          type: "movie",
          year,
        });
        count = response.count;
        const progress = `${Math.round(
          ((year - fromYear) / (toYear + 1 - fromYear) +
            ((page - 1) * recordsPerPage * 1) /
              (toYear + 1 - fromYear) /
              (Math.floor(count / recordsPerPage) * recordsPerPage)) *
            100,
        )}%`;

        const movies: MovieEntity[] = (
          await Promise.all(
            response.omdbRecords.map((omdbRecord) =>
              this.omdbApiService.findOne(omdbRecord.imdbID),
            ),
          )
        ).map(({ Title, Year, Poster, imdbID, Director, Plot }) => ({
          id: imdbID,
          title: Title,
          year: Year,
          poster: Poster,
          director: Director,
          plot: Plot,
        }));

        await this.movieRepository.save(movies);
        await this.searchService.save(
          "movie",
          movies.map(({ id, title, director, plot }) => ({
            id,
            title,
            director,
            plot,
          })),
        );
      } while (page * recordsPerPage < count);
      totalCount += count;
    }
    this.loggerService.info({
      message: `FINISHED CRON [${toString(this.time)}] : ${
        this.name
      } => Done fetching and updating ${totalCount} records`,
    });
  };

  public start = () => {
    new Cron.CronJob(this.time, this.run).start();
  };
}
