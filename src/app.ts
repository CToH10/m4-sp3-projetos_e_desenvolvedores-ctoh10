import express, { Application } from "express";
import {
  checkDeveloperKeys,
  checkDevExists,
  checkDevHasInfo,
  checkInfoKeys,
  emailAlreadyInUse,
} from "./middlewares/postDev.middleware";
import { startDatabase } from "../src/database/index";
import {
  createDeveloper,
  deleteDev,
  listAllDevs,
  listDev,
  updateDev,
} from "../src/logic/developers.logic";
import { createDevInfo, updateDevInfo } from "../src/logic/devInfo.logic";
import {
  checkDevHasNoInfo,
  checkUpdateDevKeys,
  checkUpdateInfoKeys,
} from "./middlewares/patchDev.middlewares";
import {
  checkProjDev,
  checkProjKeys,
} from "./middlewares/postProject.middlewares";
import { createProject, listAllProjs, listAProj } from "./logic/project.logic";

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
app.patch(
  "/developers/:id/infos",
  checkDevExists,
  checkDevHasNoInfo,
  checkUpdateInfoKeys,
  updateDevInfo
);
app.delete("/developers/:id", checkDevExists, deleteDev);

app.post("/projects", checkProjDev, checkProjKeys, createProject);
app.get("/projects", listAllProjs);
app.get("/projects/:id", listAProj);

const port: number = 3000;
const message: string = `Server is running on: http://localhost:${port}`;

app.listen(port, async () => {
  await startDatabase();
  console.log(message);
});
