import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function ok<T>(res: Response, data: T, message?: string): void {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  res.status(200).json(body);
}

export function created<T>(res: Response, data: T): void {
  res.status(201).json({ success: true, data } satisfies ApiResponse<T>);
}

export function noContent(res: Response): void {
  res.status(204).send();
}
