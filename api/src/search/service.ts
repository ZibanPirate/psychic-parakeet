import { ConfigService } from "../config/service";
import { RedisOptions } from "ioredis";
import { Redisearch } from "redis-modules-sdk";
import { Service } from "typedi";

@Service()
export class SearchService {
  constructor(private configService: ConfigService) {
    this.client = new Redisearch(
      this.configService.env().SEARCH_DB_URI as RedisOptions,
    );
  }

  private client: Redisearch;

  public setupDB = async () => {
    await this.client.connect();
    // FT.CREATE moviesIndex ON HASH PREFIX 1 movie: SCHEMA title TEXT WEIGHT 5.0 director TEXT WEIGHT 5.0 plot TEXT
    try {
      await this.client.create(
        "moviesIndex",
        [
          {
            name: "title",
            type: "TEXT",
            weight: 5,
          },
          {
            name: "director",
            type: "TEXT",
            weight: 2,
          },
          {
            name: "plot",
            type: "TEXT",
          },
        ],
        { prefix: [{ name: "movie", count: 1 }] },
      );
    } catch (error) {
      if (
        Error(error).message !==
        "Error: Redisearch: ReplyError: Index already exists"
      ) {
        throw error;
      }
    }
  };

  public save = async (
    type: string,
    documents: SearchDBEntity | SearchDBEntity[],
  ) => {
    const docs = Array.isArray(documents) ? documents : [documents];
    // hset [type]:[id] key1 "value1" ... keyN "valueN"
    const calls = docs.map(({ id, ...doc }) => {
      const args = [
        `${type}:${id}`,
        "title",
        "spo",
        ...Object.keys(doc).reduce<string[]>(
          (pV, cV) => [...pV, `${cV}`, `"${doc[cV] || ""}"`],
          [],
        ),
      ];

      return this.client.sendCommand("hset", args);
    });
    await Promise.all(calls);
  };

  public search = async (index: string, query: string) => {
    const response = await this.client.search(index, query, {
      noContent: false,
      limit: { first: 0, num: 100 },
    });
    let count = 0;
    let records: SearchDBEntity[] = [];
    if (Array.isArray(response) && response.length > 1) {
      count = response[0] as number;
      records = response
        .filter((item, index) => index % 2 !== 0)
        .map((id) => ({ id }));
    }
    return {
      count,
      records,
    };
  };
}

export class SearchDBEntity {
  id!: string;
  [key: string]: string | number | undefined;
}
