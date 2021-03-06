import "reflect-metadata";

import Container from "typedi";
import { LoggerService } from "../src/logger/service";

interface Config {
  deps: Array<{
    name: string;
    condition: () => Promise<boolean>;
  }>;
  interval?: number;
}

const loggerService = Container.get(LoggerService);

export const waitFor = async ({ deps, interval = 1000 }: Config) => {
  do {
    try {
      const areReady = await Promise.all(deps.map((dep) => dep.condition()));
      loggerService.info({
        message: JSON.stringify(
          deps.map(
            ({ name }, i) => `${name} is ${areReady[i] ? "UP" : "DOWN"}`,
          ),
        ),
      });
      if (!areReady.includes(false)) {
        process.exit(0);
      }
      await sleep(interval);
    } finally {
    }
  } while (1);
};

const sleep = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};
