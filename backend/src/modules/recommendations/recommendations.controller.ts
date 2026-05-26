import { Request, Response, NextFunction } from 'express';
import { recommendationsService } from './recommendations.service';
import { ok } from '../../common/response';

export const recommendationsController = {
  async getForChild(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await recommendationsService.getForChild(req.params.childId);
      ok(res, result);
    } catch (err) {
      next(err);
    }
  },
};
