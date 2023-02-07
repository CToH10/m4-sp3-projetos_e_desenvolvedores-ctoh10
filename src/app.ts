import express, { Application } from "express";
import {
  checkDeveloperKeys,
  checkDevExists,
  checkInfoKeys,
  emailAlreadyInUse,
} from "../src/middlewares/post.middleware";
import { startDatabase } from "../src/database/index";
import {
  createDeveloper,
  createDevInfo,
  listAllDevs,
  listDev,
} from "../src/logic/developers.logic";

const app: Application = express();

app.use(express.json());

app.post("/developers", checkDeveloperKeys, emailAlreadyInUse, createDeveloper);
app.post("/developers/:id", checkDevExists, checkInfoKeys, createDevInfo);
app.get("/developers", listAllDevs);
app.get("/developers/:id", listDev);

const port: number = 3000;
const message: string = `Server is running on: http://localhost:${port}`;

app.listen(port, async () => {
  await startDatabase();
  console.log(message);
});
