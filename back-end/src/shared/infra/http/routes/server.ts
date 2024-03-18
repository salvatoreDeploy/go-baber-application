import "reflect-metadata";
import 'dotenv/config'
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { errors } from "celebrate"
import "express-async-errors";
import { routes } from "./routes";
import Upload from "@config/Upload";
import { AppError } from "@shared/error/AppError";
import '@shared/container'
import rateLimiter from "../middleware/rateLimiter";

const app = express();

app.use(rateLimiter)
app.use(cors());
app.use(express.json());

routes.use("/files", express.static(Upload.uploadsFolder));

app.use(routes);

app.use(errors())

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });

    next();
  }
);

app.get("/", (request: Request, response: Response) => {
  return response.json({
    message: "Hello Word",
  });
});

app.listen(3333, () => {
  console.log("Server is runing");
});
