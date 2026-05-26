import { Request, Response, NextFunction } from 'express';
import { sessionsService } from './sessions.service';
import { ok, created } from '../../common/response';

export const sessionsController = {
  async getByChildId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sessionsService.getByChildId(req.params.childId);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const session = await sessionsService.create(req.body);
      created(res, session);
    } catch (err) {
      next(err);
    }
  },
};
