import { Request, Response, NextFunction, Router } from 'express';
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
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Invalid request data',
      details: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.message,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
  });
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const wrapAsyncRoutes = (router: Router) => {
  const originalMethods = ['get', 'post', 'put', 'delete', 'patch'] as const;

  originalMethods.forEach((method) => {
    const originalMethod = router[method].bind(router);
    (
      router as Record<
        typeof method,
        (
          path: string,
          ...handlers: Array<
            (
              req: Request,
              res: Response,
              next: NextFunction
            ) => void | Promise<void>
          >
        ) => Router
      >
    )[method] = function (
      path: string,
      ...handlers: Array<
        (
          req: Request,
          res: Response,
          next: NextFunction
        ) => void | Promise<void>
      >
    ) {
      const wrappedHandlers = handlers.map((handler) => {
        if (
          typeof handler === 'function' &&
          handler.constructor.name === 'AsyncFunction'
        ) {
          return asyncHandler(handler);
        }
        return handler;
      });
      return originalMethod(path, ...wrappedHandlers);
    };
  });

  return router;
};
