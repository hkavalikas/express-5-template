import { Request, Response, NextFunction, Router } from 'express';

export const wrapAsync = (
  fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const asyncRouterWrapper = (router: Router) => {
  const originalGet = router.get;
  const originalPost = router.post;
  const originalPut = router.put;
  const originalDelete = router.delete;
  const originalPatch = router.patch;

  router.get = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((handler) =>
      handler.constructor.name === 'AsyncFunction'
        ? wrapAsync(handler)
        : handler
    );
    return originalGet.call(this, path, ...wrappedHandlers);
  };

  router.post = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((handler) =>
      handler.constructor.name === 'AsyncFunction'
        ? wrapAsync(handler)
        : handler
    );
    return originalPost.call(this, path, ...wrappedHandlers);
  };

  router.put = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((handler) =>
      handler.constructor.name === 'AsyncFunction'
        ? wrapAsync(handler)
        : handler
    );
    return originalPut.call(this, path, ...wrappedHandlers);
  };

  router.delete = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((handler) =>
      handler.constructor.name === 'AsyncFunction'
        ? wrapAsync(handler)
        : handler
    );
    return originalDelete.call(this, path, ...wrappedHandlers);
  };

  router.patch = function (path: string, ...handlers: any[]) {
    const wrappedHandlers = handlers.map((handler) =>
      handler.constructor.name === 'AsyncFunction'
        ? wrapAsync(handler)
        : handler
    );
    return originalPatch.call(this, path, ...wrappedHandlers);
  };

  return router;
};
