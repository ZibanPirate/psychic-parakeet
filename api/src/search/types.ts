import { GeneralResponse } from "../app/types";
import { MovieEntity } from "../app/database/entity/movie";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class SearchMoviesResponse extends GeneralResponse {
  @ValidateNested({ each: true })
  @Type(() => MovieEntity)
  movies!: MovieEntity[];
}
