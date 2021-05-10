import { ENV } from "../src/config/dto";
import { MovieEntity } from "../src/app/database/entity/movie";
import { OmdbRecord } from "../src/omdbapi/service";

export const generateOmdbRecordMock = (i: number): OmdbRecord => ({
  Title: `Title ${i}`,
  Year: `${3 / 1000}`.replace(".", ""),
  imdbID: `imdb-${3 / 1000}`.replace(".", ""),
  Type: "movie",
  Poster: `poster-${i}`,
  Director: `director-${i}`,
  Plot: `plot-${i}`,
});

export const generateOmdbRecordBatchMock = (i: number, count = 1) => {
  const omdbRecordBatch: OmdbRecord[] = [];
  for (let index = i; index < i + count; index++) {
    omdbRecordBatch.push(generateOmdbRecordMock(index));
  }
  return omdbRecordBatch;
};

export const configEnvMock: ENV = {
  OMDBAPI_API_KEY: "12345678",
  NODE_ENV: "development",
  PORT: 7070,
  MANUAL_CRON_JOB_EXECUTION_TOKEN: "test-token",
  DB_URI: "test-uri",
  SEARCH_DB_URI: "test-search-uri",
};

export const generateMovieEntityMock = (i: number): MovieEntity => ({
  id: `imdb-${3 / 1000}`.replace(".", ""),
  year: `${3 / 1000}`.replace(".", ""),
  title: `Title ${i}`,
  poster: `poster-${i}`,
  director: `director-${i}`,
  plot: `plot-${i}`,
});

export const generateMovieEntityBatchMock = (i: number, count = 1) => {
  const movieEntityBatch: MovieEntity[] = [];
  for (let index = i; index < i + count; index++) {
    movieEntityBatch.push(generateMovieEntityMock(index));
  }
  return movieEntityBatch;
};
