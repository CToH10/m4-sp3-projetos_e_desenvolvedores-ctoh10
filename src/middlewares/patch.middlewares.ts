import { Request, Response, NextFunction } from "express";
import { iDevInfoRequiredKeys, OS } from "../interfaces/developer.interfaces";

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
      message: `At least one of those keys must be send.`,
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
  const preferences: OS[] = ["Linux", "MacOS", "Windows"];
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
      message: `Preferred OS values are: ${joinedPreference}; case sensitive, check spelling`,
    });
  }

  if (preferredOS) {
    request.devUpdateInfo = { preferredOS: preferredOS };
  }

  if (developerSince) {
    request.devUpdateInfo = {
      ...request.dev,
      developerSince: new Date(`${developerSince} GMT`),
    };
  }

  return next();
};
