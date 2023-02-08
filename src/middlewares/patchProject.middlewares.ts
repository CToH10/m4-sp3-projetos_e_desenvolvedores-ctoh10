import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { iPossibleProjKeys } from "../interfaces/projects.interfaces";

export const checkProjExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);

  const queryString: string = `
    SELECT 
        *
    FROM 
        projects pj
    WHERE
        pj."id" = $1;`;

  const queryConfig: QueryConfig = { text: queryString, values: [id] };

  const queryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found",
    });
  }

  return next();
};

export const checkUpdateProjKeys = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const bodyKeys: string[] = Object.keys(request.body);
  const possibleKeys: iPossibleProjKeys[] = [
    "description",
    "developerId",
    "endDate",
    "estimatedTime",
    "startDate",
    "repository",
    "name",
  ];

  const joinedPossible: string = possibleKeys.join(", ");

  const atLeastOne: boolean = possibleKeys.some((key: string) => {
    return bodyKeys.includes(key as iPossibleProjKeys);
  });

  if (!atLeastOne) {
    return response.status(400).json({
      message: `At least one of the following: ${joinedPossible}`,
    });
  }

  if (request.body.description) {
    request.projUp = { description: request.body.description };
  }

  if (request.body.developerId) {
    request.projUp = {
      ...request.projUp,
      developerId: request.body.developerId,
    };
  }

  if (request.body.endDate) {
    request.projUp = { ...request.projUp, endDate: request.body.endDate };
  }

  if (request.body.estimatedTime) {
    request.projUp = {
      ...request.projUp,
      estimatedTime: request.body.estimatedTime,
    };
  }

  if (request.body.startDate) {
    request.projUp = {
      ...request.projUp,
      startDate: request.body.startDate,
    };
  }

  if (request.body.repository) {
    request.projUp = {
      ...request.projUp,
      repository: request.body.repository,
    };
  }

  if (request.body.name) {
    request.projUp = {
      ...request.projUp,
      name: request.body.name,
    };
  }

  return next();
};
