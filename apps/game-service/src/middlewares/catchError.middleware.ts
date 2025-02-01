import { NextFunction, Request, Response } from "express";
import { ApiError, ApiResponse } from "#/lib/structures";
import mongoose from "mongoose";
import colors from "../../../../packages/shared/shared-dist/color";
export const errorMiddleware = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode =
    error.statusCode || error instanceof mongoose.Error ? 400 : 500;
  const message = error.message ?? "Something went wrong";
  error = new ApiError(statusCode, message);
  console.error(colors.red(`Seesh, Error came at route ${_req.route}`), error);
  res.status(statusCode).json(new ApiResponse(statusCode, message, error));
};
