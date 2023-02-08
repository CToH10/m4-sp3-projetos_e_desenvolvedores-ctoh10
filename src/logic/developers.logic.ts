import { Request, response, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iDeveloperRequest,
  iDevInfoRequest,
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

export const createDevInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const devInfoRequest: iDevInfoRequest = { ...request.devInfo, devID: id };

  const queryString: string = format(
    `
    INSERT INTO
        developers_infos(%I)
    VALUES
        (%L)
    RETURNING *;
    `,
    Object.keys(devInfoRequest),
    Object.values(devInfoRequest)
  );

  const queryResult: iDevResult = await client.query(queryString);

  const infoID = queryResult.rows[0].id;

  const queryTemp: string = `
    UPDATE
        developers
    SET
        (%I) = ROW(%L)
    WHERE 
        developers."id" = $1
    RETURNING *;
`;

  const queryFormat: string = format(queryTemp, "developers_infoID", infoID);
  const queryConfig: QueryConfig = { text: queryFormat, values: [id] };
  const updateDev: iDevResult = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

export const updateDev = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const devKeys = Object.keys(request.devUpdate);
  const devValues = Object.values(request.devUpdate);

  const queryTemp: string = `
    UPDATE
        developers
    SET
        (%I) = ROW(%L)
    WHERE 
        developers."id" = $1
    RETURNING *;
`;

  const queryFormat: string = format(queryTemp, devKeys, devValues);
  const queryConfig: QueryConfig = { text: queryFormat, values: [id] };

  const queryResult: iDevResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};
