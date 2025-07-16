import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createCustomError = (message: string, statusCode: number) => {
  return new AppError(message, statusCode);
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    console.error('Validation error:', error.errors);
    res.status(400).json({
      error: 'Invalid request data',
      details: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    console.error('Application error:', error.message);
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  console.error('Unexpected error:', error);

  res.status(500).json({
    error: 'Internal server error',
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
