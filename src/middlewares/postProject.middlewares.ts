import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { iDevResult } from "../interfaces/developer.interfaces";
import {
  iRequiredProjKeys,
  iTech,
  ProjResult,
  TechResult,
} from "../interfaces/projects.interfaces";

export const checkProjKeys = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const bodyKeys: string[] = Object.keys(request.body);
  const {
    description,
    developerId,
    estimatedTime,
    name,
    repository,
    startDate,
    endDate,
  } = request.body;
  const requiredKeys: iRequiredProjKeys[] = [
    "description",
    "developerId",
    "estimatedTime",
    "name",
    "repository",
    "startDate",
  ];

  const allRequired: boolean = requiredKeys.every((key: string) => {
    return bodyKeys.includes(key as iRequiredProjKeys);
  });

  const joinedKeys = requiredKeys.join(", ");

  if (!allRequired) {
    return response
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}` });
  }

  request.proj = endDate
    ? {
        description: description,
        developerId: developerId,
        estimatedTime: estimatedTime,
        name: name,
        repository: repository,
        startDate: new Date(`${startDate} GMT`),
        endDate: new Date(`${endDate} GMT`),
      }
    : {
        description: description,
        developerId: developerId,
        estimatedTime: estimatedTime,
        name: name,
        repository: repository,
        startDate: new Date(`${startDate} GMT`),
      };

  return next();
};

export const checkProjDev = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.body.developerId);
  if (!id) {
    return response
      .status(400)
      .json({ message: "Inform dev responsible for project" });
  }
  const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        id=$1`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: iDevResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({ message: `Developer not found` });
  }

  return next();
};

export const checkTechKeys = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const techName: string = request.body.name || request.params.name;

  if (!techName) {
    return response.status(400).json({ message: "Provide name" });
  }
  const queryString: string = `
    SELECT
        *
    FROM
        technologies
    WHERE
        name=$1;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [techName],
  };

  const queryResult: TechResult = await client.query(queryConfig);

  const techString: string = `
    SELECT
        name
    FROM
        technologies;`;

  const techResult: TechResult = await await client.query(techString);

  const techOptions = techResult.rows.map((tech) => {
    return tech.name;
  });

  if (queryResult.rowCount === 0) {
    return response.status(400).json({
      message: `Technology not supported`,
      options: techOptions,
    });
  }

  request.tech = {
    name: techName,
    id: queryResult.rows[0].id,
  };

  return next();
};

export const checkProjAlreadyHasTech = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = request.tech;
  const projID: string = request.params.id;
  const queryString: string = `
  SELECT
      "techID"
  FROM
      projects_technologies pt
  WHERE
    pt."techID" = $1 AND pt."projectID" = $2 ;`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id, projID],
  };
  const techResult: TechResult = await client.query(queryConfig);

  if (techResult.rowCount !== 0 && request.method === "POST") {
    return response.status(409).json({
      message: `Project already has ${request.tech.name} registered`,
    });
  }

  if (techResult.rowCount === 0 && request.method === "PATCH") {
    return response.status(400).json({
      message: `Project has no ${request.tech.name} registered`,
    });
  }
  return next();
};
