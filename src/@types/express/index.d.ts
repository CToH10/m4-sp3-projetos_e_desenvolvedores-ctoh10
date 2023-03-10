import express from "express";
import { OS } from "../../interfaces/developer.interfaces";
import { iProjRequest, iTech } from "../../interfaces/projects.interfaces";

declare global {
  namespace Express {
    interface Request {
      dev: { name: string; email: string };
      devUpdate: Partial<dev>;
      devInfo: { preferredOS: OS; developerSince: Date };
      devUpdateInfo: Partial<devInfo>;
      proj: iProjRequest;
      projUp: Partial<iProjRequest>;
      tech: iTech;
    }
  }
}
