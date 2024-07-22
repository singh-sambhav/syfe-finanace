import { Request, Response, NextFunction } from "express";
import ApiError from "./ApiError";

type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(
      requestHandler(req, res, next).catch((err: ApiError) => {
        next(err);
      })
    );
  }; 
};

export default asyncHandler;
