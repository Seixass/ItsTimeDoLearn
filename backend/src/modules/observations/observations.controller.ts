import { Request, Response, NextFunction } from 'express';
import { observationsService } from './observations.service';
import { ok, created } from '../../common/response';

export const observationsController = {
  async getByChildId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await observationsService.getByChildId(req.params.childId);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const observation = await observationsService.create(req.body);
      created(res, observation);
    } catch (err) {
      next(err);
    }
  },
};
