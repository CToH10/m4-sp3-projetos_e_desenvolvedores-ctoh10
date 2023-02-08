import express, { Application } from "express";
import {
  checkDeveloperKeys,
  checkDevExists,
  checkDevHasInfo,
  checkInfoKeys,
  emailAlreadyInUse,
} from "../src/middlewares/post.middleware";
import { startDatabase } from "../src/database/index";
import {
  createDeveloper,
  createDevInfo,
  listAllDevs,
  listDev,
  updateDev,
} from "../src/logic/developers.logic";
import { checkUpdateDevKeys } from "../src/middlewares/patch.middlewares";

const app: Application = express();

app.use(express.json());

app.post("/developers", checkDeveloperKeys, emailAlreadyInUse, createDeveloper);
app.post(
  "/developers/:id",
  checkDevExists,
  checkDevHasInfo,
  checkInfoKeys,
  createDevInfo
);
app.get("/developers", listAllDevs);
app.get("/developers/:id", listDev);
app.patch(
  "/developers/:id",
  checkDevExists,
  checkUpdateDevKeys,
  emailAlreadyInUse,
  updateDev
);

const port: number = 3000;
const message: string = `Server is running on: http://localhost:${port}`;

app.listen(port, async () => {
  await startDatabase();
  console.log(message);
});
