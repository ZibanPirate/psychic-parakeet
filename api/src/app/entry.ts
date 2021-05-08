import "reflect-metadata";

import express from "express";
import { port } from "../config";
import { runCronJobs } from "./cron-jobs/setup";
const app = express();

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

runCronJobs();
