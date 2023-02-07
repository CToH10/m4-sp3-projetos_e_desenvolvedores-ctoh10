import express from "express";

declare global {
  namespace Express {
    interface Request {
      dev: { name: string; email: string };
    }
  }
}
