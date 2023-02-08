import { QueryResult } from "pg";

export interface iProjRequest {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  developerId: number;
}

export type iRequiredProjKeys =
  | "name"
  | "description"
  | "estimatedTime"
  | "repository"
  | "startDate"
  | "developerId";

export type iPossibleProjKeys = iRequiredProjKeys | "endDate";

export type ProjResult = QueryResult<iProjRequest>;
