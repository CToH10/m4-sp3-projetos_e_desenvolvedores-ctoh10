import { NextFunction, Request, Response } from "express";
import { iDevRequiredKeys } from "../interfaces/developer.interfaces";

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
      .status(400)
      .json({ message: `Required keys are: ${joinedKeys}` });
  }

  return next();
};
