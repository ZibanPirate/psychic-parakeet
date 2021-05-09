import { ConfigService } from "../config/service";
import { Redisearch } from "redis-modules-sdk";
import { Service } from "typedi";

@Service()
export class SearchService {
  constructor(private configService: ConfigService) {
    this.client = new Redisearch(this.configService.env().SEARCH_DB_URI);
  }

  private client: Redisearch;

  public setupDB = async () => {
    await this.client.connect();
  };
}
