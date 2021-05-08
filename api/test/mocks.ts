import { ENVDto } from "../src/config/dto";
import { OmdbRecord } from "../src/omdbapi/service";

export const generateOmdbRecordMock = (i: number): OmdbRecord => ({
  Title: `Title ${i}`,
  Year: `${3 / 1000}`.replace(".", ""),
  imdbID: `imdb-${3 / 1000}`.replace(".", ""),
  Type: "movie",
  Poster: `poster-${i}`,
});

export const generateOmdbRecordBatchMock = (i: number, count = 1) => {
  const omdbRecordBatch: OmdbRecord[] = [];
  for (let index = i; index < count; index++) {
    omdbRecordBatch.push(generateOmdbRecordMock(index));
  }
  return omdbRecordBatch;
};

export const configEnvMock: ENVDto = {
  OMDBAPI_API_KEY: "12345678",
  NODE_ENV: "development",
  PORT: 7070,
};
