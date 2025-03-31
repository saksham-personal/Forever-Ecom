
import express, { Application, Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.get("/", (req: Request, res: Response): void => {
  res.send("API Working");
});

export default app;
