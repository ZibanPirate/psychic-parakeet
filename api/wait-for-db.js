/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const { Client } = require("pg");
const Redis = require("ioredis");

const deps = [
  {
    name: "Postgres",
    condition: async function () {
      try {
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
    condition: async function () {
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

async function sleep(time) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

async function waitForDependencies() {
  do {
    try {
      const areReady = await Promise.all(deps.map((dep) => dep.condition()));
      console.log(
        deps.map(({ name }, i) => `${name} is ${areReady[i] ? "UP" : "DOWN"}`),
      );
      if (!areReady.includes(false)) {
        process.exit(0);
      }
      await sleep(200);
    } finally {
    }
  } while (1);
}

waitForDependencies();
