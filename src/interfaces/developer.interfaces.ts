import { QueryResult } from "pg";

export interface iDeveloperRequest {
  name: string;
  email: string;
}

export interface iDeveloper extends iDeveloperRequest {
  id: number;
  developers_infoID: number | null;
}

export type iDevResult = QueryResult<iDeveloper>;

export type iDevRequiredKeys = "name" | "email";
