import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "../database";
import {
  iDevInfoRequiredKeys,
  iDevResult,
  OS,
} from "../interfaces/developer.interfaces";

export const checkUpdateDevKeys = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const { name, email } = request.body;
  const emailValidation: boolean =
    email?.includes("@") && email?.includes(".com");

  if (!emailValidation && email) {
    return response.status(400).json({ message: `Invalid email format` });
  }

  if (!name && !email) {
    return response.status(400).json({
      message: `At least one of those keys must be sent.`,
      keys: ["name", "email"],
    });
  }

  if (name) {
    request.devUpdate = { name: name };
  }

  if (email) {
    request.devUpdate = { ...request.dev, email: email };
  }

  return next();
};

export const checkUpdateInfoKeys = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const { preferredOS, developerSince } = request.body;
  const possibleKeys: iDevInfoRequiredKeys[] = [
    "developerSince",
    "preferredOS",
  ];
  const preferences: OS[] = ["Windows", "Linux", "MacOS"];
  const preferred: boolean = preferences.includes(request.body.preferredOS);
  const joinedPreference: string = preferences.join(", ");

  if (!preferredOS && !developerSince) {
    return response.status(400).json({
      message: `At least one of those keys must be send.`,
      keys: possibleKeys,
    });
  }

  if (!preferred && preferredOS) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: preferences,
    });
  }

  if (preferredOS) {
    request.devUpdateInfo = { preferredOS: preferredOS };
  }

  if (developerSince) {
    request.devUpdateInfo = {
      ...request.devUpdateInfo,
      developerSince: new Date(`${developerSince} GMT`),
    };
  }

  return next();
};

export const checkDevHasNoInfo = async (
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

  if (!queryResult.rows[0].developers_infoID) {
    return response.status(400).json({
      message: `Developer has no info. You need to create it`,
    });
  }

  return next();
};
