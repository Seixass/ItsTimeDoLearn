import { Request, Response, NextFunction } from 'express';
import { weeklyPlansService } from './weekly_plans.service';
import { ok } from '../../common/response';

export const weeklyPlansController = {
  async getByChildId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await weeklyPlansService.getByChildId(req.params.childId);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async upsert(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await weeklyPlansService.upsert(req.params.childId, req.body);
      ok(res, plan);
    } catch (err) {
      next(err);
    }
  },
};
