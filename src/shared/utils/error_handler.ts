
import { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants";
import { CustomError } from "../../domain/utils/custom.error";
import logger from "./error.logger";

export const handleErrorResponse = (
  req: Request,
  res: Response,
  error: unknown
) => {
  console.error("🔥 REAL ERROR:", error);

  logger.error(`[${req.method}] ${req.url} - ${(error as Error).message}`, {
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    stack: (error as Error).stack,
  });

  if (error instanceof ZodError) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.issues,
    });
  }

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message:
      error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
  });
};
export const expressErrorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return handleErrorResponse(req, res, error);
};
