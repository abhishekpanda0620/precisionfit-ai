import { Request, Response, NextFunction } from 'express';

/**
 * Wraps an async route handler to catch errors and forward them consistently.
 * Eliminates duplicated try/catch blocks in every route.
 */
export function asyncHandler(
  fn: (req: Request<any>, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request<any>, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: Error) => {
      console.error(`[API ERROR] ${req.method} ${req.originalUrl}:`, error.message);
      res.status(500).json({ error: 'Internal server error' });
    });
  };
}
