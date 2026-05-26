import { Request, Response, NextFunction } from 'express';
import { goalsService } from './goals.service';
import { ok, created } from '../../common/response';

export const goalsController = {
  async getByChildId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await goalsService.getByChildId(req.params.childId);
      ok(res, data);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await goalsService.create(req.body);
      created(res, goal);
    } catch (err) {
      next(err);
    }
  },

  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentValue } = req.body as { currentValue: number };
      const goal = await goalsService.updateProgress(req.params.id, currentValue);
      ok(res, goal);
    } catch (err) {
      next(err);
    }
  },

  async toggleActive(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await goalsService.toggleActive(req.params.id);
      ok(res, goal);
    } catch (err) {
      next(err);
    }
  },
};
