import { Request, Response, NextFunction } from "express";

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
  const devId = parseInt(request.params.id);
  const infoKeys: string[] = Object.keys(request.body);
  const requiredKeys: iDevInfoRequiredKeys[] = [
    "developerSince",
    "preferredOS",
  ];
  const preferences: OS[] = ["Linux", "MacOS", "Windows"];

  const preferred: boolean = preferences.includes(request.body.preferredOS);

  const joinedKeys: string = requiredKeys.join(", ");
  const joinedPreference: string = preferences.join(", ");

  if (!preferred) {
    return response.status(400).json({
      message: `Preferred OS values are: ${joinedPreference}; case sensitive, check spelling`,
    });
  }
};
