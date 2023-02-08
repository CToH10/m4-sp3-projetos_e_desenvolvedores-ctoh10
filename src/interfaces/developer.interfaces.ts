import { QueryResult } from "pg";

export interface iDeveloperRequest {
  name: string;
  email: string;
}

export interface iDeveloper extends iDeveloperRequest {
  id: number;
  developers_infoID: number | null;
}

export type OS = "Windows" | "Linux" | "MacOS";

export interface iDevInfoRequest {
  developerSince: Date;
  preferredOS: OS;
  devID: number;
}

export interface iDevInfo extends iDevInfoRequest {
  id: number;
}

export type iDevResult = QueryResult<iDeveloper>;
export type iDevInfoResult = QueryResult<iDevInfo>;

export type iDevRequiredKeys = "name" | "email";
export type iDevInfoRequiredKeys = "preferredOS" | "developerSince";
