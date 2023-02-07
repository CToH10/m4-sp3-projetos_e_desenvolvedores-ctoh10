import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import {
  iDevRequiredKeys,
  iDevResult,
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
