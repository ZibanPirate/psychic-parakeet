import { Client } from "pg";
import Redis from "ioredis";
import { waitFor } from "./wait-for";

const deps = [
  {
    name: "Postgres",
    condition: async () => {
      try {
        console.log(process.env.DB_URI);

        const client = new Client(process.env.DB_URI);
        await client.connect();
        await client.end();
        return true;
      } catch (error) {
        return false;
      }
    },
  },
  {
    name: "Redisearch",
    condition: async () => {
      try {
        await new Promise((res, rej) => {
          const redis = new Redis(process.env.SEARCH_DB_URI);
          redis.on("connect", () => {
            res({});
          });
          redis.on("error", () => {
            rej({});
          });
        });
        return true;
      } catch (error) {
        return false;
      }
    },
  },
];

waitFor({ deps });
