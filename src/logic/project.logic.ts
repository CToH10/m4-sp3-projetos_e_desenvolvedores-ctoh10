import { Request, Response } from "express";
import format from "pg-format";
import { client } from "../database";
import { ProjResult } from "../interfaces/projects.interfaces";

export const createProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projKeys: string[] = Object.keys(request.proj);
  const projValues: string[] = Object.values(request.proj);

  const queryTemp: string = format(
    `
    INSERT INTO
        projects(%I)
    VALUES
        (%L)
    RETURNING *;
  `,
    projKeys,
    projValues
  );

  const queryResult: ProjResult = await client.query(queryTemp);
  return response.status(201).json(queryResult.rows[0]);
};
