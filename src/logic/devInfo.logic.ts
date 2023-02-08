import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "../database";
import {
  iDevInfoRequest,
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
