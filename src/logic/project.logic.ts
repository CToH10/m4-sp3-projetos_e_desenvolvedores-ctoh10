import { Request, Response } from "express";
import { QueryConfig } from "pg";
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

export const listAllProjs = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const queryString: string = `
    SELECT 
        pj."id" AS "projectID", pj."name" AS "projectName", pj."description" AS "projectDescription", pj."estimatedTime" AS "projectEstimatedTime", pj."repository" AS "projectRepository", pj."startDate" AS "projectStartDate", pj."endDate" AS "projectEndDate", pj."developerId" AS "projectDeveloperID", tech."id" AS "technologyID", tech."name" AS "technologyName"
    FROM 
        projects pj
    LEFT JOIN
        projects_technologies pt
    ON 
        pt."projectID" = pj."id"
    LEFT JOIN
        technologies tech
    ON
        pt."techID" = tech."id";`;

  const queryResult = await client.query(queryString);
  return response.json(queryResult.rows);
};

export const listAProj = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id = parseInt(request.params.id);
  const queryString: string = `
    SELECT 
        pj."id" AS "projectID", pj."name" AS "projectName", pj."description" AS "projectDescription", pj."estimatedTime" AS "projectEstimatedTime", pj."repository" AS "projectRepository", pj."startDate" AS "projectStartDate", pj."endDate" AS "projectEndDate", pj."developerId" AS "projectDeveloperID", tech."id" AS "technologyID", tech."name" AS "technologyName"
    FROM 
        projects pj
    LEFT JOIN
        projects_technologies pt
    ON 
        pt."projectID" = pj."id"
    LEFT JOIN
        technologies tech
    ON
        pt."techID" = tech."id"
    WHERE
        pj."id" = $1;`;

  const queryConfig: QueryConfig = { text: queryString, values: [id] };

  const queryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "No projects found",
    });
  }
  return response.json(queryResult.rows);
};

export const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = parseInt(request.params.id);
  const projKeys = Object.keys(request.projUp);
  const projValues = Object.values(request.projUp);

  const queryTemp: string = `
    UPDATE
        projects
    SET
        (%I) = ROW(%L)
    WHERE 
        projects."id" = $1
    RETURNING *;
`;

  const queryFormat: string = format(queryTemp, projKeys, projValues);
  const queryConfig: QueryConfig = { text: queryFormat, values: [id] };

  const queryResult: ProjResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

export const deleteProj = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const id: number = Number(request.params.id);

  const queryTemp: string = `
    DELETE FROM
      projects
    WHERE
      id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryTemp,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).json();
};

export const addTech = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.tech;
  const projId: number = parseInt(request.params.id);

  const techString: string = format(
    `
    INSERT INTO
      projects_technologies(%I)
    VALUES
      (%L);
  `,
    ["techID", "projectID"],
    [id, projId]
  );

  await client.query(techString);

  const queryString: string = `
    SELECT 
        pj."id" AS "projectID", pj."name" AS "projectName", pj."description" AS "projectDescription", pj."estimatedTime" AS "projectEstimatedTime", pj."repository" AS "projectRepository", pj."startDate" AS "projectStartDate", pj."endDate" AS "projectEndDate", pj."developerId" AS "projectDeveloperID", tech."id" AS "technologyID", tech."name" AS "technologyName"
    FROM 
        projects pj
    LEFT JOIN
        projects_technologies pt
    ON 
        pt."projectID" = pj."id"
    LEFT JOIN
        technologies tech
    ON
        pt."techID" = tech."id"
    WHERE
        pt."projectID" = $1 AND pt."techID" = $2;`;

  const queryConfig: QueryConfig = { text: queryString, values: [projId, id] };

  const queryResult = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

export const deleteTech = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.tech;
  const projID: number = parseInt(request.params.id);

  const queryString: string = `
    DELETE FROM
      projects_technologies pt
    WHERE
      pt."techID" = $1 AND pt."projectID" = $2;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, projID],
  };

  await client.query(queryConfig);
  return response.status(204).json();
};
