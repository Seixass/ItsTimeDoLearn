import { Request, Response, NextFunction } from 'express';
import { AppError } from '../common/errors';
import { env } from '../config/env';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, error: err.message });
    return;
  }

  if (err instanceof Error) {
    if (env.isDev) {
      console.error('[error]', err.stack);
    } else {
      console.error('[error]', err.message);
    }
  }

  res.status(500).json({ success: false, error: 'Erro interno do servidor' });
}
