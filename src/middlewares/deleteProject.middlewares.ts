import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { TechResult } from "../interfaces/projects.interfaces";

export const confirmProjTech = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: string = request.params.name;
  const projID: string = request.params.id;
  const queryString: string = `
      SELECT
          t."name", t."id"
      FROM
          projects_technologies pt   
      JOIN
          technologies t  
      ON 
          pt."techID" = t."id"
      WHERE
          pt."projectID" =$1 AND t."name" = $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [projID, name],
  };
  const techResult: TechResult = await client.query(queryConfig);

  if (techResult.rowCount === 0) {
    return response.status(400).json({
      message: `Project has no ${name} registered`,
    });
  }

  request.tech = {
    name: techResult.rows[0].name,
    id: techResult.rows[0].id,
  };

  return next();
};
