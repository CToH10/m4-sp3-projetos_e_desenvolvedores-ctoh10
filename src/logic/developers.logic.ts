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

export const listAllDevs = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT 
        devs."id" AS "developerID",
        devs."name" AS "developerName",
        devs."email" AS "developerEmail",
        devsinfo."id" AS "developerInfoID",
        devsinfo."developerSince" AS "developerInfoDeveloperSince",
        devsinfo."preferredOS" AS "developerInfoPreferredOS"
    FROM 
        developers devs
    LEFT JOIN
        developers_infos devsInfo
    ON
        devs."developers_infoID" = devsinfo."id";
      `;

  const queryResult: iDevResult[] = await (
    await client.query(queryString)
  ).rows;
  return response.json(queryResult);
};

export const listDev = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT 
        devs."id" AS "developerID",
        devs."name" AS "developerName",
        devs."email" AS "developerEmail",
        devsinfo."id" AS "developerInfoID",
        devsinfo."developerSince" AS "developerInfoDeveloperSince",
        devsinfo."preferredOS" AS "developerInfoPreferredOS"
    FROM 
        developers devs
    LEFT JOIN
        developers_infos devsInfo
    ON
        devs."developers_infoID" = devsinfo."id"
    WHERE
        devs."id" = $1;
        `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [request.params.id],
  };

  const queryResult: iDevResult[] = await (
    await client.query(queryConfig)
  ).rows[0];

  if (queryResult === undefined) {
    return response.status(404).json({ message: "Developer not found" });
  }
  return response.json(queryResult);
};
