import { createConnection, useContainer } from "typeorm";
import { Container } from "typeorm-typedi-extensions";

// use typeorm-typedi-extensions container (typedi's)
useContainer(Container);

export const setupDB = (url: string) =>
  createConnection({
    type: "postgres",
    url,
    entities: [__dirname + "/entity/**/*.{js,ts}"],
    migrations: [__dirname + "/migration/**/*.{js,ts}"],
    subscribers: [__dirname + "/subscriber/**/*.{js,ts}"],
    synchronize: false,
    logging: false,
  });
