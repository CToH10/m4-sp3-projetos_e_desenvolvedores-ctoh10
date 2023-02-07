import { Request, response, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iDeveloperRequest,
  iDevResult,
} from "../interfaces/developer.interfaces";

export const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const devRequest: iDeveloperRequest = request.dev;

  const queryString: string = format(
    `
    INSERT INTO
        developers(%I)
    VALUES
        (%L)
    RETURNING *;
  `,
    Object.keys(devRequest),
    Object.values(devRequest)
  );

  const queryResult: iDevResult = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};
