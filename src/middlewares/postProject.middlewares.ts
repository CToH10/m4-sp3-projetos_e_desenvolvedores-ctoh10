import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import { iDevResult } from "../interfaces/developer.interfaces";
import { iRequiredProjKeys } from "../interfaces/projects.interfaces";

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
      .status(409)
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
