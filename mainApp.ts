import { Application, Request, Response } from "express";
import router from "./router/router";

export const mainApp = async (app: Application) => {
  try {
    app.use("/api", router);
    app.get("/", (req: Request, res: Response): any => {
      try {
        return res.status(201).json({
          message: "Welcome to Wisdom Tech Hack Challenge 2",
        });
      } catch (error) {
        return res.status(404).json({
          message: "Error",
          status: 404,
        });
      }
    });
  } catch (error) {
    return error;
  }
};
