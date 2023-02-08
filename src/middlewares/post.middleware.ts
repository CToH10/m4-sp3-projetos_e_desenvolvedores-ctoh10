import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import {
  iDevInfoRequiredKeys,
  iDevRequiredKeys,
  iDevResult,
  OS,
} from "../interfaces/developer.interfaces";

export const checkDeveloperKeys = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const bodyKeys: string[] = Object.keys(request.body);
  const requiredKeys: iDevRequiredKeys[] = ["email", "name"];

  const allRequired: boolean = requiredKeys.every((key: string) => {
    return bodyKeys.includes(key as iDevRequiredKeys);
  });

  const joinedKeys = requiredKeys.join(", ");

  if (!allRequired) {
    return response
      .status(409)
      .json({ message: `Required keys are: ${joinedKeys}` });
  }

  const emailValidation: boolean =
    request.body.email.includes("@") && request.body.email.includes(".com");

  if (!emailValidation) {
    return response.status(400).json({ message: `Invalid email format` });
  }

  request.dev = { name: request.body.name, email: request.body.email };

  return next();
};

export const emailAlreadyInUse = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const queryString: string = `
  SELECT
  *
  FROM
  developers
  WHERE
  email=$1`;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [request.body.email],
  };

  const queryResult: iDevResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return next();
  }

  return response
    .status(400)
    .json({ message: `${request.body.email} already in use` });
};

export const checkInfoKeys = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const infoKeys: string[] = Object.keys(request.body);
  const requiredKeys: iDevInfoRequiredKeys[] = [
    "developerSince",
    "preferredOS",
  ];
  const preferences: OS[] = ["Linux", "MacOS", "Windows"];

  const allRequired: boolean = requiredKeys.every((key: string) => {
    return infoKeys.includes(key as iDevInfoRequiredKeys);
  });

  const preferred: boolean = preferences.includes(request.body.preferredOS);

  const joinedKeys: string = requiredKeys.join(", ");
  const joinedPreference: string = preferences.join(", ");

  if (!allRequired) {
    return response
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}` });
  }

  if (!preferred) {
    return response.status(400).json({
      message: `Preferred OS values are: ${joinedPreference}; case sensitive, check spelling`,
    });
  }

  request.devInfo = {
    developerSince: new Date(`${request.body.developerSince} GMT`),
    preferredOS: request.body.preferredOS,
  };

  return next();
};

export const checkDevExists = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
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

export const checkDevHasInfo = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(request.params.id);
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

  if (queryResult.rows[0].developers_infoID) {
    return response
      .status(409)
      .json({ message: `Developer already has info. You can update it` });
  }
};
