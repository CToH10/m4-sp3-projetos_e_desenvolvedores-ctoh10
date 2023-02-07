import express, { Application } from "express";
import { checkDeveloperKeys } from "../src/middlewares/post.middleware";
import { startDatabase } from "../src/database/index";

const app: Application = express();

app.use(express.json());

app.post("/developers", checkDeveloperKeys);

const port: number = 3000;
const message: string = `Server is running on: http://localhost:${port}`;

app.listen(port, async () => {
  await startDatabase();
  console.log(message);
});
