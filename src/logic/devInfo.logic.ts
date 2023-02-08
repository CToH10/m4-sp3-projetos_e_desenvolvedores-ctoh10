import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iDevInfoRequest,
  iDevInfoResult,
  iDevResult,
} from "../interfaces/developer.interfaces";

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

export const updateDevInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const devInfoKeys = Object.keys(request.devUpdateInfo);
  const devInfoValues = Object.values(request.devUpdateInfo);
  console.log(devInfoValues);

  const queryTemp: string = `
      UPDATE
          developers_infos
      SET
          (%I) = ROW(%L)
      WHERE 
      developers_infos."devID" = $1
      RETURNING *;
  `;

  const queryFormat: string = format(queryTemp, devInfoKeys, devInfoValues);
  const queryConfig: QueryConfig = { text: queryFormat, values: [id] };
  const updateDevInfo: iDevInfoResult = await client.query(queryConfig);

  return response.status(201).json(updateDevInfo.rows[0]);
};
