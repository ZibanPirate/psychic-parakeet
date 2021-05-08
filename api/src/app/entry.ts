import "reflect-metadata";

import { ConfigService } from "../config/service";
import Container from "typedi";
import express from "express";
import { runCronJobs } from "./cron-jobs/setup";
const app = express();

app.get("/", function (req, res) {
  res.send("hello world");
});

const { NODE_ENV, PORT } = Container.get(ConfigService).env();

app.listen(PORT, () => {
  console.log(
    `Example app listening at ${
      NODE_ENV === "development" ? "http://localhost:" : "port: "
    }${PORT}`,
  );
});

runCronJobs();
