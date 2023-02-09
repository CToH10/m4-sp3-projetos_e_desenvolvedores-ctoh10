CREATE DATABASE IF NOT EXISTS developers_projects;

CREATE TYPE "OS" AS ENUM ('Windows', 'MacOS', 'Linux');

CREATE TABLE IF NOT EXISTS developers_infos(
    "id" SERIAL PRIMARY KEY,
    "developerSince" DATE NOT NULL,
    "preferredOS" "OS" NOT NULL
);

CREATE TABLE IF NOT EXISTS developers(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS projects(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedTime" VARCHAR(20) NOT NULL,
    "repository" VARCHAR(120) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE
);

CREATE TABLE IF NOT EXISTS technologies(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects_technologies(
    "id" SERIAL PRIMARY KEY,
    "addedIn" DATE DEFAULT NOW()
);


INSERT INTO
    technologies("name")
VALUES
   ('JavaScript'), ('Python'), ('React'), ('Express.js'), ('HTML'), ('CSS'), ('Django'), ('PostgreSQL'), ('MongoDB');


ALTER TABLE developers
ADD "developers_infoID" INTEGER UNIQUE DEFAULT NULL; 

ALTER TABLE developers
ADD FOREIGN KEY ("developers_infoID" ) REFERENCES developers_infos("id") ON DELETE SET NULL;

ALTER TABLE projects
ADD "developerId" INTEGER NOT NULL;

ALTER TABLE projects
ADD FOREIGN KEY ("developerId") REFERENCES developers("id") ON DELETE CASCADE;

ALTER TABLE projects_technologies
ADD "projectID" INTEGER NOT NULL; 

ALTER TABLE projects_technologies
ADD FOREIGN KEY ("projectID" ) REFERENCES projects("id") ON DELETE CASCADE;

ALTER TABLE projects_technologies
ADD "techID" INTEGER NOT NULL;

ALTER TABLE projects_technologies
ADD FOREIGN KEY ("techID" ) REFERENCES technologies("id") ON DELETE CASCADE;