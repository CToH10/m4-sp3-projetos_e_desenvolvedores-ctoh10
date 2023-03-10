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
  listDevProjects,
  updateDev,
} from "../src/logic/developers.logic";
import { createDevInfo, updateDevInfo } from "../src/logic/devInfo.logic";
import {
  checkDevHasNoInfo,
  checkUpdateDevKeys,
  checkUpdateInfoKeys,
} from "./middlewares/patchDev.middlewares";
import {
  checkProjAlreadyHasTech,
  checkProjDev,
  checkProjKeys,
  checkTechKeys,
} from "./middlewares/postProject.middlewares";
import {
  checkProjExists,
  checkUpdateProjKeys,
} from "./middlewares/patchProject.middlewares";
import { confirmProjTech } from "./middlewares/deleteProject.middlewares";
import {
  addTech,
  createProject,
  deleteProj,
  deleteTech,
  listAllProjs,
  listAProj,
  updateProject,
} from "./logic/project.logic";

const app: Application = express();

app.use(express.json());

app.post("/developers", checkDeveloperKeys, emailAlreadyInUse, createDeveloper);
app.post(
  "/developers/:id/infos",
  checkDevExists,
  checkDevHasInfo,
  checkInfoKeys,
  createDevInfo
);
app.get("/developers", listAllDevs);
app.get("/developers/:id", listDev);
app.get("/developers/:id/projects", checkDevExists, listDevProjects);
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
app.post(
  "/projects/:id/technologies",
  checkProjExists,
  checkTechKeys,
  checkProjAlreadyHasTech,
  addTech
);
app.get("/projects", listAllProjs);
app.get("/projects/:id", listAProj);
app.patch("/projects/:id", checkProjExists, checkUpdateProjKeys, updateProject);
app.delete(
  "/projects/:id/technologies/:name",
  checkProjExists,
  checkTechKeys,
  confirmProjTech,
  deleteTech
);
app.delete("/projects/:id", checkProjExists, deleteProj);

const port: number = 3000;
const message: string = `Server is running on: http://localhost:${port}`;

app.listen(port, async () => {
  await startDatabase();
  console.log(message);
});
