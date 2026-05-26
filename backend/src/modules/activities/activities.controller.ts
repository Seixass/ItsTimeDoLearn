import { Request, Response, NextFunction } from 'express';
import { activitiesService } from './activities.service';
import { ok } from '../../common/response';

export const activitiesController = {
  async listAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activities = await activitiesService.listAll(
        req.query as Record<string, string>,
      );
      ok(res, activities);
    } catch (err) {
      next(err);
    }
  },

  async getByCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activity = await activitiesService.getByCode(req.params.code);
      ok(res, activity);
    } catch (err) {
      next(err);
    }
  },
};
