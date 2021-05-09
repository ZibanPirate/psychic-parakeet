import { EntityRepository, Repository } from "typeorm";
import { MovieEntity } from "../app/database/entity/movie";
import { Service } from "typedi";

@Service()
@EntityRepository(MovieEntity)
export class MovieRepository extends Repository<MovieEntity> {}
