import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to verify internal API requests between Next.js and Express.
 * Checks the x-api-key header against the INTERNAL_API_SECRET env var.
 */
export function verifyInternalRequest(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.INTERNAL_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized internal request' });
  }
  next();
}
